# Happy National Girlfriend Day ♥

A static, interactive love-letter website made for Nur Emiera Fifiyana.

The music button plays **New West — Those Eyes** from `assets/music/those-eyes.mp3`.

## Personalise the photos

Open the site in a browser and click a gallery card to preview a photo. Those previewed photos are only stored in that browser session. For the photos to be visible to Emiera when she opens the deployed link, add image files to `assets/photos/` and update the four `<img>` tags in `index.html` with their relative paths, for example:

```html
<img src="assets/photos/us-1.jpg" alt="A favorite photo of us" />
```

## Publish with GitHub Pages

1. Push this project to the `main` branch of `lordicad/HNGFDMYPRINCESS`.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. Save. GitHub will provide the live site URL after the deployment finishes.

The page has no build step; `index.html` is ready to deploy as-is.
