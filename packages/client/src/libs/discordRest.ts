import { REST } from '@discordjs/rest';
import { DISCORD_BOT_TOKEN, NODE_ENV } from './constants';

const DiscordRestGlobal = global as typeof global & {
  DiscordRest: REST;
};

export const DiscordRest =
  DiscordRestGlobal.DiscordRest ||
  new REST({
    version: '9',
  }).setToken(DISCORD_BOT_TOKEN);

export const setTokenAsBot = () => {
  DiscordRest.setToken(DISCORD_BOT_TOKEN);
};

if (DiscordRest.listenerCount('rateLimited') === 0) {
  if (NODE_ENV !== 'production') {
    DiscordRestGlobal.DiscordRest = DiscordRest;

    DiscordRest.on('request', req => {
      console.log(`>> ${req.method} ${req.route}`, req.path, req.data);
    });

    DiscordRest.on('response', async (req, res) => {
      console.log(`<< ${res.status} ${req.route}`, await res.json());
    });

    DiscordRest.on('restDebug', info => {
      console.log('Discord API', info);
    });
  }

  DiscordRest.on('rateLimited', info => {
    console.log('Discord API - Rate Limited', info);
  });
}
