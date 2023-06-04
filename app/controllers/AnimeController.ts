import BaseController from './BaseController';
import * as express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

type AnimeTitle = {
    original: string;
    synonyms: string;
    english: string;
    japanese: string;
};

type AnimeDetail = {
    type: string;
    episodes: number;
    status: string;
    aired: {
        from: string;
        to: string;
    };
    premiered: string;
    broadcast: string;
    producers: Array<string>;
    licensors: Array<string>;
    studios: Array<string>;
    source: string;
    genres: Array<string>;
    themes: Array<string>;
    duration: string;
    rating: string;
    statistic: {
        score: {
            value: number;
            scoredBy: string;
        };
        ranked: string;
        popularity: string;
        members: string;
        favorites: string;
    };
};

type AnimeSong = {
    opening: Array<{
        title: string;
        episode: string;
        artist: string;
        play: {
            spotify: string;
            appleMusic: string;
            amazoneMusic: string;
            youtubeMusic: string;
        };
    }>;
    ending: Array<{
        title: string;
        episode: string;
        artist: string;
        play: {
            spotify: string;
            appleMusic: string;
            amazoneMusic: string;
            youtubeMusic: string;
        };
    }>;
};

type AnimeDetailData = {
    title: AnimeTitle;
    url: URL;
    id: string;
    detail: AnimeDetail;
    song: AnimeSong;
};

type AnimeSearchData = {
    title: string;
    id: string;
    url: URL;
};

type AnimeTopData = {
    rank: number;
    title: string;
    id: string;
    url: URL;
    score: string;
};

interface BaseData<T> {
    sendData(res: express.Response, data: T): void;
}

export default class AnimeController extends BaseController {
    private res: express.Response;
    constructor(res: express.Response) {
        super();
        if(!res) throw new Error('Response is required!');
        this.res = res;
    }

    search(title: string): BaseData<Array<AnimeSearchData>> {
                    axios
                        .get(`https://myanimelist.net/anime.php?cat=anime&q=${encodeURIComponent(title)}`)
                        .then((res) => {
                            const $ = cheerio.load(res.data);
                            const data: Array<AnimeSearchData> = [];
                            $('.js-categories-seasonal.js-block-list.list table tbody tr').each((i, el) => {
                                if (i == 0) return;
                                const title = $(el).find('td').eq(1).find('a strong').text();
                                const id = $(el).find('td').eq(1).find('a').attr('href').split('anime/')[1].split('/')[0];
                                const url = new URL($(el).find('td').eq(1).find('a').attr('href'));
                                data.push({
                                    title,
                                    id,
                                    url,
                                });
                            });
                            resolve(data);
                        })
                        .catch(reject);


        const returnData = {
            sendData: () => this.sendData<Array<AnimeSearchData>>(this.res, data)
        }

        return returnData;
    }

    getDetail(id: string): BaseData<AnimeDetailData> {
        
    }

    getTop(type: string, page: number, top: number): Array<AnimeTopData> {
        
    }
}
