FROM node:18-slim

# Install Chromium deps for Puppeteer
RUN apt-get update && apt-get install -y \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxi6 \
  libxtst6 \
  libnss3 \
  libcups2 \
  libxrandr2 \
  libasound2 \
  libpangocairo-1.0-0 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libgbm1 \
  libxss1 \
  fonts-liberation \
  wget \
  && rm -rf /var/lib/apt/lists/*

# Then copy your app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "server.js"]
