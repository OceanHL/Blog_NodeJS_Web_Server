import { IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';

export interface MyIncomingMessage extends IncomingMessage {
    path?: string;
    query?: ParsedUrlQuery;
    cookie?: { [key: string]: string };
    session?: { [key: string]: any };
    sessionID: string;
}
export type MyRequestListener<ReturnType, BodyType = any> = (
    req: MyIncomingMessage & { body?: BodyType },
    res: ServerResponse
) => ReturnType;
