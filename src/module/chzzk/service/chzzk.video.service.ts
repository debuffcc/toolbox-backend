import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { ChzzkVideoApiResponse } from '../type';
import { DOMParser } from 'xmldom';

export interface VideoInfoResult {
  channelName: string;
  videoTitle: string;
  videoCategory: string;
  videoCategoryValue: string;
}

export interface VideoFrameUrl {
  quality: string;
  url: string;
}

export interface VideoSummary {
  videoNo: number;
  videoTitle: string;
  thumbnailImageUrl: string;
  duration: number;
  publishDate: string;
}

export interface ChzzkVideoProxyResponse {
  videoInfo: VideoInfoResult;
  frameUrls: VideoFrameUrl[];
  prevVideo?: VideoSummary;
  nextVideo?: VideoSummary;
}

@Injectable()
export class ChzzkVideoService {
  async getVideo(videoNo: string) {
    const videoInfoData = await this.getVideoInfo(videoNo);
    const content = videoInfoData?.content;
    if (!content) {
      throw new HttpException('비디오 정보가 없습니다.', HttpStatus.NOT_FOUND);
    }
    const videoInfo: VideoInfoResult = {
      channelName: content.channel?.channelName || '',
      videoTitle: content.videoTitle || '',
      videoCategory: content.videoCategory || '',
      videoCategoryValue: content.videoCategoryValue || '',
    };
    const xml = await this.getVideoUrls(content.videoId, content.inKey);
    const frameUrls = this.parseFrameUrlsFromXml(xml);

    const prevVideo = content.prevVideo
      ? {
          videoNo: content.prevVideo.videoNo,
          videoTitle: content.prevVideo.videoTitle,
          thumbnailImageUrl: content.prevVideo.thumbnailImageUrl,
          duration: content.prevVideo.duration,
          publishDate: content.prevVideo.publishDate,
        }
      : undefined;

    const nextVideo = content.nextVideo
      ? {
          videoNo: content.nextVideo.videoNo,
          videoTitle: content.nextVideo.videoTitle,
          thumbnailImageUrl: content.nextVideo.thumbnailImageUrl,
          duration: content.nextVideo.duration,
          publishDate: content.nextVideo.publishDate,
        }
      : undefined;

    return {
      videoInfo,
      frameUrls,
      prevVideo,
      nextVideo,
    };
  }

  async getVideoInfo(videoNo: string): Promise<ChzzkVideoApiResponse> {
    try {
      const apiUrl = `https://api.chzzk.naver.com/service/v3/videos/${videoNo}`;
      const response = await fetch(apiUrl, {
        headers: {
          accept: 'application/json',
          origin: 'https://chzzk.naver.com',
          referer: 'https://chzzk.naver.com/',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (!response.ok) throw new Error('네이버 API 요청 실패');
      return (await response.json()) as ChzzkVideoApiResponse;
    } catch (e) {
      throw new HttpException('네이버 API 요청 실패', HttpStatus.BAD_GATEWAY);
    }
  }

  async getVideoUrls(videoId: string, inKey: string) {
    try {
      const apiUrl = `https://apis.naver.com/neonplayer/vodplay/v1/playback/${videoId}?key=${inKey}`;
      const response = await fetch(apiUrl, {
        headers: {
          accept: 'application/xml',
          origin: 'https://chzzk.naver.com',
          referer: 'https://chzzk.naver.com/',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (!response.ok) throw new Error('네이버 XML API 요청 실패');
      const xml = await response.text();
      return xml;
    } catch (e) {
      throw new HttpException(
        '네이버 XML API 요청 실패',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  parseFrameUrlsFromXml(xmlText: string): VideoFrameUrl[] {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');
    const reps = Array.from(xml.getElementsByTagName('Representation'));
    const result: VideoFrameUrl[] = [];
    reps.forEach((rep: any) => {
      let quality = '';
      const mimeType = rep.getAttribute('mimeType');
      if (mimeType !== 'video/mp4') {
        return;
      }
      const labels = rep.getElementsByTagName('nvod:Label');
      for (let i = 0; i < labels.length; i++) {
        const kind = labels[i].getAttribute('kind');
        if (kind === 'resolution') {
          quality = labels[i].textContent || '';
        }
      }
      const baseUrlEl = rep.getElementsByTagName('BaseURL')[0];
      if (baseUrlEl && quality) {
        result.push({
          quality: quality + 'P',
          url: baseUrlEl.textContent || '',
        });
      }
    });
    return result.sort((a, b) => parseInt(b.quality) - parseInt(a.quality));
  }
}
