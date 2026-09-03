#!/bin/bash

echo "🚀 Starting frontend deployment..."

# Add all changes
git add .

# Commit with timestamp
git commit -m "Auto deploy $(date '+%Y-%m-%d %H:%M:%S')"

# Push to remote
git push

echo "✅ Code pushed to remote"
echo "🌐 Deploying to production..."

# SSH to production server and deploy
ssh ubuntuh2@ubuntuhaus.co.ke << 'ENDSSH'
cd /home/ubuntuh2/domains/ubuntuhaus.co.ke/public_html
git pull
echo "✅ Production deployment complete"
ENDSSH

echo "🎉 Deployment finished!"
