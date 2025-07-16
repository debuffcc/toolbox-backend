export interface ChzzkVideoApiResponse {
  code: number;
  message: string | null;
  content: ChzzkVideoContent;
}

export interface ChzzkVideoContent {
  videoNo: number;
  videoId: string;
  videoTitle: string;
  videoType: string;
  publishDate: string;
  thumbnailImageUrl: string;
  trailerUrl: string | null;
  duration: number;
  readCount: number;
  publishDateAt: number;
  categoryType: string;
  videoCategory: string;
  videoCategoryValue: string;
  exposure: boolean;
  adult: boolean;
  clipActive: boolean;
  livePv: number;
  tags: string[];
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string;
    verifiedMark: boolean;
    activatedChannelBadgeIds: string[];
  };
  blindType: string | null;
  watchTimeline: any;
  paidProductId: string | null;
  paidPromotion: boolean;
  inKey: string;
  liveOpenDate: string;
  vodStatus: string;
  liveRewindPlaybackJson: any;
  prevVideo?: ChzzkVideoSummary;
  nextVideo?: ChzzkVideoSummary;
  userAdultStatus: any;
  adParameter: { tag: string };
  videoChatEnabled: boolean;
  videoChatChannelId: string;
  paidProduct: any;
}

export interface ChzzkVideoSummary {
  videoNo: number;
  videoId: string;
  videoTitle: string;
  videoType: string;
  publishDate: string;
  thumbnailImageUrl: string;
  trailerUrl: string | null;
  duration: number;
  readCount: number;
  publishDateAt: number;
  categoryType: string;
  videoCategory: string;
  videoCategoryValue: string;
  exposure: boolean;
  adult: boolean;
  clipActive: boolean;
  livePv: number;
  tags: string[];
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string;
    verifiedMark: boolean;
    activatedChannelBadgeIds: string[];
  };
  blindType: string | null;
  watchTimeline: any;
  paidProductId: string | null;
}
