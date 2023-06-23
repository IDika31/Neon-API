import { ValidationError, validationResult } from 'express-validator';
import randomBytes from 'randombytes'

export const makeErrorMessage = (statusCode: 400 | 401 | 408 | 500 | 503, type: 'query' | 'params' | 'body' | 'missing_params', errorsDetail: ValidationError[]) => {
    const code = [
        {
            code: 'bad_request',
            statusCode: 400,
            message: 'Bad Request',
        },
        {
            code: 'invalid_credentials',
            statusCode: 401,
            message: 'Unauthorized',
        },
        {
            code: 'request_timeout',
            statusCode: 408,
            message: 'Request Timeout',
        },
        {
            code: 'internal_server_error',
            statusCode: 500,
            message: 'Internal Server Error',
        },
        {
            code: 'service_unavailable',
            statusCode: 503,
            message: 'Service Unavailable',
        },
    ];

    return {
        success: false,
        statusCode,
        message: 'Request processed failed',
        error: {
            code: code.find((x) => x.statusCode == statusCode)?.code,
            message: code.find((x) => x.statusCode == statusCode)?.message,
            details: errorsDetail.map((v) => {
                return {
                    code: type == 'query' ? ((v.msg as string).includes('must be a valid') ? 'invalid_query_value' : 'missing_query') : type == 'body' ? 'invalid_body_value' : type == 'params' ? 'invalid_params_value' : 'missing_parameter',
                    message: v.msg,
                };
            }),
        },
        data: null,
    };
};

export const makeSuccessMessage = (statusCode: 200, data: any) => {
    return {
        success: true,
        statusCode,
        message: 'Request processed successfully',
        error: null,
        data,
    };
};

export const formatNumber = (number: number | string): string => {
    const formattedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return formattedNumber;
};

export const generateApiKey = (group?: number[]): string => {
    group = (group) ? group : [2,2,2,2];
    return group.map((v) => randomBytes(v).toString('hex').toUpperCase()).join('-');

};
