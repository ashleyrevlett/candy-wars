# Candy Wars

Homage to Dope Wars in Javascript

## Description

Knock-off of the classic Dope Wars DOS/TI-83 game. Developed with TypeScript, Vue.js 3, Vite, and Pinia.

## Demo

Check out the demo: https://wonderful-frangollo-ca35d1.netlify.app

## Usage

Install and run it locally:
```
nvm use stable
npm install
npm run dev
```

Build for production with `npm run build`

### Using Firebase for High Scores

This app uses Google Firebase (with anonymous login) and Firestore for storing high scores. To set it up, create a Firestore database, then update the `.env` file with your config info.

For the db rules, use:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null
      allow create: if request.auth != null &&
        // must have exactly 2 fields with keys 'name', 'score'
        request.resource.data.size() == 2 && request.resource.data.keys().hasAll(['name', 'score']) &&
        // string field must be less than 101 characters
        request.resource.data.name is string && request.resource.data.name.size() < 101 &&
        // score field must be positive int
        request.resource.data.score is int && request.resource.data.score > -1
    }
  }
}
```

---

## Acknowledgments

- [Original Dope Wars game](https://dopewars.sourceforge.io/)
- DOS Font: [The Ultimate Oldschool PC Font Pack](http://int10h.org/oldschool-pc-fonts/)
- ASCII art car based on art by [Hayley Jane Wakenshaw](https://www.asciiart.eu/vehicles/cars)
- "Oh yeah" SFX by [Alshred](https://freesound.org/people/Alshred/sounds/403828/)
- Car SFX by [AMrdjan](https://freesound.org/people/AMrdjan/sounds/635194/)
- Cha-ching SFX from [Soundboard](https://www.soundboard.com/sb/sound/962818)
- Boxing bell SFX by [Benboncan](https://freesound.org/people/Benboncan/sounds/66951/)
- Win Jingle by [LittleRobotSoundFactory](https://freesound.org/people/LittleRobotSoundFactory/sounds/270331/)
- Spit SFX by [Gidion](https://freesound.org/people/Gidion/sounds/366808/)
