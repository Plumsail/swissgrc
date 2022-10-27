export default class ScriptLoader {
    static _loaders: { [src: string]: Promise<any> } = {};

    static async loadScript(src: string, globals: IGlobals) {
        src = src.toLowerCase();

        if (!this._loaders[src]) {
            this._loaders[src] = new Promise((resolve, reject) => {
                try {
                    const el = document.createElement('script');
                    const container = document.head || document.body;

                    el.type = 'text/javascript';
                    el.async = true;
                    el.src = src;

                    el.addEventListener('load', () => {
                        resolve(globals?.globalExportsName ? window[globals?.globalExportsName] : null);
                    });

                    el.addEventListener('error', () => {
                        reject({
                            status: false,
                            message: `Failed to load the script ${src}`
                        });
                    });

                    container.appendChild(el);
                } catch (e) {
                    reject(e);
                }
            });
        }

        return this._loaders[src];
    }
}

interface IGlobals {
    globalExportsName: string;
}
