# Deploying to Render.com

Render is a great platform for hosting Node.js applications and PostgreSQL databases. Follow these steps to get your Content Broadcasting System live.

## Step 1: Push Code to GitHub
Before deploying, your code needs to be on a platform like GitHub.
1. Create a new repository on [GitHub](https://github.com/).
2. Push your local code to the repository:
   ```bash
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

## Step 2: Set up PostgreSQL Database on Render
You need a live database for production.
1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **PostgreSQL**.
3. Name your database (e.g., `content-broadcasting-db`).
4. Select the Free tier and click **Create Database**.
5. Once created, scroll down to the **Connections** section. You will need these details in Step 4. Specifically, look for:
   - Host (External or Internal)
   - Port
   - Database
   - Username
   - Password

## Step 3: Create a Web Service on Render
1. Go back to the Render Dashboard, click **New +** and select **Web Service**.
2. Select **Build and deploy from a Git repository**.
3. Connect your GitHub account and select your repository.
4. Fill in the deployment details:
   - **Name**: `content-broadcasting-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Select the **Free** instance type.

## Step 4: Add Environment Variables
Before clicking "Create Web Service", scroll down and click **Advanced**, then click **Add Environment Variable**. You need to add all the variables from your local `.env` file.

**Database Variables (Get these from Step 2):**
- `DB_HOST`: *Your Render DB Hostname (Use the "Internal Database URL" host for faster, secure connections)*
- `DB_PORT`: `5432`
- `DB_NAME`: *Your Render Database Name*
- `DB_USER`: *Your Render Database Username*
- `DB_PASS`: *Your Render Database Password*

**Application Variables:**
- `NODE_ENV`: `production`
- `JWT_SECRET`: *Create a long, random string for production*
- `JWT_EXPIRES_IN`: `1d`
- `SALT_ROUNDS`: `10`

**Cloudinary Variables (From your Cloudinary account):**
- `CLOUDINARY_CLOUD_NAME`: `dx0uekrvo`
- `CLOUDINARY_API_KEY`: `156351155834238`
- `CLOUDINARY_API_SECRET`: `skmGzaaTWC2Da5phygOQmS-g608`

## Step 5: Deploy
1. Click **Create Web Service** at the bottom of the page.
2. Render will now clone your repo, run `npm install`, and start your server using `npm start`.
3. In the logs console, you should eventually see:
   `🚀 Server is running on port 10000 in production mode`
   `✅ PostgreSQL connection has been established successfully.`

## Important Note About File Uploads on Render
Render's free tier uses an **ephemeral filesystem**. This means any files saved to the local `/uploads` folder will be **deleted** whenever the server restarts (which happens on every new deployment or period of inactivity).

However, because we implemented **Cloudinary** for cloud storage, your system will work perfectly! The files are uploaded to Cloudinary, and the Cloudinary URL is saved to the database. The ephemeral local storage will not affect your production data.
