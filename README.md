# Angular-CMS Template

*Frontend: Angular v17  
Backend: NestJS v10*

> [!NOTE]
> Currently not fully ready and tested.

## Getting started

*I'm using yarn as package manager.  
I assuming you're already choose this as your template.*

### Client

1. Navigate with your IDE Console into the folder `client`.
2. Use the command `yarn setup` *(This will install also server dependencies)* to install all dependencies.
3. In `client/src/environments` change both files as you wish.

### Server

*Any file which has `-example` in their name, you have to do a copy without `-example`.*

**Files you have to change:**

- `server/src/config/google-example.config.ts`
- `server/src/config/mail-example.config.ts`
- `server/src/config/typeORM-example.config.ts`
- `server/src/core/constants/jwt-example.constants.ts`

**If you need help, don't bother contacting me.**

## Features included

- Google Recaptcha
- Mail Module
- Rest Service
  - Basic API Calls
  - You can extend from it
  - There is also a protected controller inside
- Roles integration
  - User
  - Manager
  - Admin
  - Developer
- User Registration & Login system
- Usage of JwtToken & JwtRefreshToken
- Front basic setup
- CMS basic setup

## Support me

If you want to give me a [tip](https://www.paypal.me/DTDonate) :black_heart:.
