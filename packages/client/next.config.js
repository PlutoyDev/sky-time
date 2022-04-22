const { config } = require('dotenv');

const { error, parsed } = config({
  path: `../../.env`,
});

if (error) {
  throw error;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: parsed,
};

module.exports = nextConfig;
