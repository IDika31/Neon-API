import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';
import * as entities from 'html-entities';

import { formatNumber } from '../../config';
import * as redis from '../database/redis.db';

const decode = (str: string): string => entities.decode(str, { level: 'html5', scope: 'body' });

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
    detail: string;
};

type AnimeTopData = {
    rank: number;
    title: string;
    id: string;
    url: URL;
    score: string;
};

export default class AnimeController {
    constructor() {}

    search(title: string, path: string): Promise<Array<AnimeSearchData>> {
        return new Promise<Array<AnimeSearchData>>((resolve, reject) => {
            axios
                .get(`https://myanimelist.net/anime.php?cat=anime&q=${encodeURIComponent(title)}`)
                .then((res) => {
                    if (res.status == 404) reject('Not Found');

                    const $ = load(res.data);
                    const data: Array<AnimeSearchData> = [];
                    $('.js-categories-seasonal.js-block-list.list table tbody tr').each((i, el) => {
                        if (i == 0) return;
                        const title = $(el).find('td').eq(1).find('a strong').text();
                        const id = ($(el).find('td').eq(1).find('a').attr('href') as string).split('anime/')[1].split('/')[0];
                        const url = new URL($(el).find('td').eq(1).find('a').attr('href') as string);
                        data.push({
                            title,
                            id,
                            url,
                            detail: `${path}/api/v1/anime/detail/${id}`,
                        });
                    });
                    resolve(data);
                })
                .catch(reject);
        });
    }

    getDetail(id: string): Promise<AnimeDetailData> {
        return new Promise(async (resolve, reject) => {
            const redisData = await redis.redisGet(`anime.detail.${id}`);
            if (redisData) resolve(JSON.parse(redisData));
            else {
                axios
                    .get(`https://myanimelist.net/anime/${id}`)
                    .then(async (res) => {
                        if (res.status == 404) reject('Not Found');

                        const $ = load(res.data);
                        const title = this.getAnimeTitle($);
                        const detail = this.getAnimeDetail($);
                        const song = this.getAnimeSong($);
                        const data = {
                            title,
                            url: new URL(`https://myanimelist.net/anime/${id}/${title.original.replace(/ /g, '_').replace(/\:/, '')}`),
                            id,
                            detail,
                            song,
                        };

                        await redis.redisSet(`anime.detail.${id}`, JSON.stringify(data));
                        resolve(data);
                    })
                    .catch(reject);
            }
        });
    }

    getTop(type: string, page: string = '1', top: string = '50'): Promise<Array<AnimeTopData>> {
        type = type == 'all' ? '' : (type = 'popularity') ? '?type=bypopularity&' : `?type=${type}&`;
        page = ((parseInt(page) - 1) * 50).toString();
        return new Promise<Array<AnimeTopData>>(async (resolve, reject) => {
            const redisData = await redis.redisGet(`anime.top.${type}.${page}`);
            if (redisData) resolve(JSON.parse(redisData));
            else {
                axios
                    .get(`https://myanimelist.net/topanime.php/?${type}limit=${page}`)
                    .then((res) => {
                        if (res.status == 404) reject('Not Found');

                        const $ = load(res.data);
                        const data: Array<AnimeTopData> = [];

                        $('.pb12 table tbody .ranking-list').each((i, el) => {
                            if (i >= parseInt(top)) return;
                            const rank = parseInt($(el).find('.rank.ac span').text().trim());
                            const title = $(el).find('.title.al.va-t.word-break .detail .di-ib.clearfix h3 a').text().trim();
                            const id = ($(el).find('.title.al.va-t.word-break .detail .di-ib.clearfix h3 a').attr('href') as string).split('anime/')[1].split('/')[0];
                            const url = new URL($(el).find('.title.al.va-t.word-break .detail .di-ib.clearfix h3 a').attr('href') as string);
                            const score = $(el).find('.score.ac.fs14 .js-top-ranking-score-col.di-ib.al span').text().trim();

                            data.push({
                                rank,
                                title,
                                id,
                                url,
                                score,
                            });
                        });

                        redis.redisSet(`anime.top.${type}.${page}`, JSON.stringify(data));
                        resolve(data);
                    })
                    .catch(reject);
            }
        });
    }

    private getAnimeTitle($: CheerioAPI): AnimeTitle {
        const title: AnimeTitle = {
            original: '',
            synonyms: '',
            english: '',
            japanese: '',
        };

        title.original = $('.h1.edit-info .h1-title div h1.title-name.h1_bold_none strong').text().trim();

        $('.leftside .spaceit_pad').each((i, el) => {
            switch ($(el).find('span.dark_text').text().trim().toLowerCase()) {
                case 'synonyms:':
                    title.synonyms = $(el).text().trim().split(': ').slice(1).join(': ');
                    break;
                case 'english:':
                    title.english = $(el).text().trim().split(': ').slice(1).join(': ');
                    break;
                case 'japanese:':
                    title.japanese = $(el).text().trim().split(': ').slice(1).join(': ');
                    break;
                default:
                    break;
            }
        });

        return title;
    }

    private getAnimeDetail($: CheerioAPI): AnimeDetail {
        const data = {
            type: '',
            episodes: 0,
            status: '',
            aired: {
                from: '',
                to: '',
            },
            premiered: '',
            broadcast: '',
            producers: Array(String()),
            licensors: Array(String()),
            studios: Array(String()),
            source: '',
            genres: Array(String()),
            themes: Array(String()),
            duration: '',
            rating: '',
            statistic: {
                score: {
                    value: 0,
                    scoredBy: '',
                },
                ranked: '',
                popularity: '',
                members: '',
                favorites: '',
            },
        };

        $('.leftside .spaceit_pad').each((i, el) => {
            switch ($(el).find('span.dark_text').text().trim().toLowerCase()) {
                case 'type:':
                    data.type = $(el).text().trim().split(':\n  ')[1];
                    break;
                case 'episodes:':
                    data.episodes = parseInt($(el).text().trim().split(':\n  ')[1]);
                    break;
                case 'status:':
                    data.status = $(el).text().trim().split(':\n  ')[1];
                    break;
                case 'aired:':
                    data.aired.from = $(el)
                        .text()
                        .trim()
                        .split(':\n  ')[1]
                        .split(/\s+to\s+/)[0];
                    data.aired.to = $(el)
                        .text()
                        .trim()
                        .split(':\n  ')[1]
                        .split(/\s+to\s+/)[1];
                    break;
                case 'premiered:':
                    data.premiered = $(el).text().trim().split(':\n  ')[1].trim();
                    break;
                case 'broadcast:':
                    data.broadcast = $(el).text().trim().split(':\n  ')[1].trim();
                    break;
                case 'producers:':
                    data.producers = $(el)
                        .text()
                        .trim()
                        .split(':\n  ')[1]
                        .trim()
                        .split(', ')
                        .map((v) => v.trim());
                    break;
                case 'licensors:':
                    data.licensors = $(el)
                        .text()
                        .trim()
                        .split(':\n  ')[1]
                        .trim()
                        .split(', ')
                        .map((v) => v.trim());
                    break;
                case 'studios:':
                    data.studios = $(el)
                        .text()
                        .trim()
                        .split(':\n  ')[1]
                        .trim()
                        .split(', ')
                        .map((v) => v.trim());
                    break;
                case 'source:':
                    data.source = $(el).text().trim().split(':\n  ')[1].trim();
                    break;
                case 'genre:':
                    $(el)
                        .find('span[itemprop="genre"]')
                        .each((i, el) => {
                            data.genres[i] = $(el).text().trim();
                        });
                    break;
                case 'genres:':
                    $(el)
                        .find('span[itemprop="genre"]')
                        .each((i, el) => {
                            data.genres[i] = $(el).text().trim();
                        });
                    break;
                case 'themes:':
                    $(el)
                        .find('span[itemprop="genre"]')
                        .each((i, el) => {
                            data.themes[i] = $(el).text().trim();
                        });
                    break;
                case 'duration:':
                    data.duration = $(el).text().trim().split(':\n  ')[1].trim();
                    break;
                case 'rating:':
                    data.rating = $(el).text().trim().split(':\n  ')[1].trim();
                    break;
                case 'popularity:':
                    data.statistic.popularity = $(el).text().trim().split(':\n  ')[1].trim();
                    break;
                case 'members:':
                    data.statistic.members = $(el).text().trim().split(':\n  ')[1].trim();
                    break;
                case 'favorites:':
                    data.statistic.favorites = $(el).text().trim().split(':\n  ')[1].trim();
                    break;
                default:
                    break;
            }
        });

        data.statistic.score.value = parseFloat($('.leftside .spaceit_pad.po-r.js-statistics-info.di-ib span[itemprop="ratingValue"]').text().trim());
        data.statistic.score.scoredBy = `${formatNumber($('.leftside .spaceit_pad.po-r.js-statistics-info.di-ib span[itemprop="ratingCount"]').text().trim())} users`;
        data.statistic.ranked = $('.leftside .spaceit_pad.po-r.js-statistics-info.di-ib').eq(1).text().trim().split(':\n  ')[1].trim().split('\n')[0].split('').slice(0, -1).join('');

        return data;
    }

    private getAnimeSong($: CheerioAPI): AnimeSong {
        const data: AnimeSong = {
            opening: [],
            ending: [],
        };

        $('.theme-songs.js-theme-songs.opnening table tbody tr').each((i, el) => {
            if (i < 2) return;
            data.opening[i - 2] = {
                title:
                    $(el).find('td').eq(1).find('a .theme-song-title').text().trim() != ''
                        ? $(el).find('td').eq(1).find('a .theme-song-title').text().trim().replace(/\"/g, '')
                        : decode($(el).find('td').eq(1).text().trim())
                              .split(/\:\s+\"/)[1]
                              .split('" by ')[0]
                              .replace(/ /g, ''),
                episode: $(el)
                    .find('td')
                    .eq(1)
                    .find('.theme-song-episode')
                    .text()
                    .trim()
                    .replace(/\(eps |\)/g, '')
                    ? $(el)
                          .find('td')
                          .eq(1)
                          .find('.theme-song-episode')
                          .text()
                          .trim()
                          .replace(/\(eps |\)/g, '')
                    : 'All Episode',
                artist: $(el).find('td').eq(1).find('.theme-song-artist').text().trim().replace('by ', ''),
                play: {
                    spotify: $(el).find('td').eq(1).find('input[id^="spotify_url_"]').attr('value') as string,
                    appleMusic: $(el).find('td').eq(1).find('input[id^="apple_url_"]').attr('value') as string,
                    amazoneMusic: $(el).find('td').eq(1).find('input[id^="amazon_url_"]').attr('value') as string,
                    youtubeMusic: $(el).find('td').eq(1).find('input[id^="youtube_url_"]').attr('value') as string,
                },
            };
        });

        $('.theme-songs.js-theme-songs.ending table tbody tr').each((i, el) => {
            data.ending[i] = {
                title:
                    $(el).find('td').eq(1).find('a .theme-song-title').text().trim() != ''
                        ? $(el).find('td').eq(1).find('a .theme-song-title').text().trim().replace(/\"/g, '')
                        : decode($(el).find('td').eq(1).text().trim())
                              .split(/\:\s+\"/)[1]
                              .split('" by ')[0]
                              .replace(/ /g, ''),
                episode: $(el)
                    .find('td')
                    .eq(1)
                    .find('.theme-song-episode')
                    .text()
                    .trim()
                    .replace(/\(eps |\)/g, '')
                    ? $(el)
                          .find('td')
                          .eq(1)
                          .find('.theme-song-episode')
                          .text()
                          .trim()
                          .replace(/\(eps |\)/g, '')
                    : 'All Episode',
                artist: $(el).find('td').eq(1).find('.theme-song-artist').text().trim().replace('by ', ''),
                play: {
                    spotify: $(el).find('td').eq(1).find('input[id^="spotify_url_"]').attr('value') as string,
                    appleMusic: $(el).find('td').eq(1).find('input[id^="apple_url_"]').attr('value') as string,
                    amazoneMusic: $(el).find('td').eq(1).find('input[id^="amazon_url_"]').attr('value') as string,
                    youtubeMusic: $(el).find('td').eq(1).find('input[id^="youtube_url_"]').attr('value') as string,
                },
            };
        });

        return data;
    }
}
