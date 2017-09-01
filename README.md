# Better Twitch Desktop

BTD is a script which gets injected into the Twitch Desktop client, which gives extra functionality such as allowing the use of BTTV and FFZ emotes.

Further development of features is planned - watch this space!

## Running BTD

The latest version of the script is located here:

`https://cdn.jsdelivr.net/gh/prasoc/better-twitch-desktop/releases/btd.js`

To run this in-client, click the top "☰" menu, navigate to "Window" -> "Developer Tools", then in the bottom console entry, paste the following text to inject the script into the running page:

```
(function(d, script) {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function(){
        // remote script has loaded
    };
    script.src = 'https://cdn.jsdelivr.net/gh/prasoc/better-twitch-desktop/releases/btd.js';
    d.getElementsByTagName('head')[0].appendChild(script);
}(document));
```


You will need to paste this script into the client whenever you open a new instance of the Twitch Desktop window; I will develop a better solution in later releases!


## Technical Details

The codebase requires you to install Node. Apart from that, there aren't any dependencies that aren't included in the node package.

To run in Developer mode, you can type

`npm run dev`

This starts a server on https://localhost:10443 which, with some modifications of the desktop client, you can directly inject into the page (by replacing the URL in the injector.js script with the location of the compiled JS file on localhost)

### Modification of the Twitch Desktop client (allowing "developer-mode")

You will not be able to *develop* BTD using the default Twitch Desktop client. This is because, by default, Electron blocks the self-signed localhost certificate.

To fix this, we need to allow **all** certificates to run from within the client.

#### Instructions

First run `npm i -g asar` to install globally the necessary ASAR extraction and packing tools. Then navigate to the client folder (on my Windows machine it is located at `dddd`). 

Now you are ready to modify the Twitch client.

* Navigate from the root client folder to `Bin\Electron\resources`
* Type `asar e app.asar app` to extract the "app.asar" file into `app`
* Navigate into the `app` folder.
* Open `main.js` and search for "certificate-error".

    * Replace the whole method with the following code:

```
mainWindow.webContents.on('certificate-error', function (e, url, error, certificate, callback) {
    callback(true);
});
```

* After modification of the script, type `asar e app.asar app` to re-pack the "app.asar" file.

Now you are ready to develop BTD locally: the client will accept self-signed certificates from localhost.

## License

BTD is licensed under the permissive MIT License. See "LICENSE" for more details.