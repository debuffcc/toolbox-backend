import { Injectable } from '@nestjs/common';
import { AgodaPriceResult, CID_LIST } from '../type';
import puppeteer from 'puppeteer';

@Injectable()
export class AgodaService {
  async getAgodaPrices(
    baseUrl: string,
    checkIn: string,
    los: number,
    rooms: number,
    children: number,
    adults: number,
  ) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const batchSize = 4;
    const results: AgodaPriceResult[] = [];

    for (let i = 0; i < CID_LIST.length; i += batchSize) {
      const batch = CID_LIST.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async ({ cid, label }) => {
          const page = await browser.newPage();
          await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          );
          const urlObj = new URL(baseUrl, 'http://dummy');
          const params = urlObj.searchParams;
          params.set('cid', String(cid));
          params.set('checkin', String(checkIn));
          params.set('los', String(los));
          params.set('rooms', String(rooms));
          params.set('children', String(children));
          params.set('adults', String(adults));
          urlObj.search = params.toString();
          const url =
            urlObj.origin === 'http://dummy'
              ? urlObj.pathname + urlObj.search
              : urlObj.toString();
          try {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector(
              'h1[data-selenium="hotel-header-name"]',
              {
                timeout: 7000,
              },
            );
            const hotelName = await page.$eval(
              'h1[data-selenium="hotel-header-name"]',
              (el) => el.textContent?.trim() ?? null,
            );
            let price: number | null = null;
            try {
              await page.waitForSelector('.StickyNavPrice__priceDetail', {
                timeout: 5000,
              });
              const priceText = await page.$eval(
                '.StickyNavPrice__priceDetail',
                (el) => {
                  const spans = el.querySelectorAll('span');
                  return spans.length > 0
                    ? spans[spans.length - 1]?.textContent?.replace(
                        /[^\d]/g,
                        '',
                      )
                    : '';
                },
              );
              price = priceText ? parseInt(priceText, 10) : null;
            } catch (e) {
              // 가격 정보가 없을 수도 있음
            }
            await page.close();
            return { cid, label, price, hotelName, url };
          } catch (e) {
            await page.close();
            return {
              cid,
              label,
              price: null,
              hotelName: null,
              url,
              error: true,
            };
          }
        }),
      );
      results.push(...batchResults);
    }

    await browser.close();

    // 최저가 찾기
    const min = results
      .filter((r) => r.price)
      .sort((a, b) => a.price! - b.price!)[0];
    return { results, min };
  }
}
