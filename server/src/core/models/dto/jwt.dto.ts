export interface JwtTokenDto {
    access_token: string;
    refresh_token: string;
    forceRefresh?: boolean;
}
