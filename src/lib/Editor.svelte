<script>
    import { onMount } from 'svelte'; 
    import { nanoid } from 'nanoid'
    import Mousetrap from 'mousetrap'
    import * as monaco from 'monaco-editor';
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
    import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

    // @ts-ignore
    self.MonacoEnvironment = {
        getWorker(_, label) {
            if (label === 'json') {
                return new jsonWorker();
            }
            if (label === 'css' || label === 'scss' || label === 'less') {
                return new cssWorker();
            }
            if (label === 'html' || label === 'handlebars' || label === 'razor') {
                return new htmlWorker();
            }
            if (label === 'typescript' || label === 'javascript') {
                return new tsWorker();
            }
            return new editorWorker();
        }
    };

    import {parse, stringify, toJSON, fromJSON} from 'flatted';

    let container;
    onMount(() => {
        let editor = monaco.editor.create(container, {
            // value: "function hello() {\n\talert('Hello world!');\n}",
            // language: 'markdown',
            language: 'javascript',
            theme: 'vs-dark',
            minimap: {
                enabled: false
            },
            // lineNumbers: (t) => `${t}>`,
            lineNumbers: false,
        });

        let skipWatch = false;
        if (localStorage.getItem("model")) {
            skipWatch = true;
            let { state, value, options } = JSON.parse(localStorage.getItem('model'))
            // console.log('model', model)
            // editor.restoreViewState(model);
            editor.restoreViewState(state);
            editor.setValue(value)
            // editor.updateOptions(options || {})


            skipWatch = false;
        }

		console.log(monaco.KeyMod.CtrlCmd) 
		console.log(monaco.KeyCode.KeyK) 
        console.log(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK)
        // | monaco.KeyCode.KeyK
        
        function exec() {
            const polyfills = ([
                function require(url, name) {
                    // if (!name) name = nanoid()
                    const scriptExists = document.head.querySelector("script#" + name);
                    return new Promise(resolve => {
                        // dont load it twice
                        if (scriptExists) return resolve();
                        console.time("load " + name);
                        let script = document.createElement("script");
                        if (name) script.id = name;
                        script.setAttribute("src", url);
                        script.setAttribute('type', "module");
                        document.head.appendChild(script);
                        script.addEventListener("load", () => {
                            console.timeEnd("load " + name);
                            resolve();
                        }, {once: true});
                    });
                },

            ]).map(fn=>`${fn.toString()};`).join('\n');
            function _eval(code, id) {
                // if (!id) id = nanoid()
                return new Promise(resolve => {
                    console.time("load");
                    let script = document.querySelector("script#executor");
                    if (script) script.remove();

                    script = document.createElement("script");
                    script.id = "executor";
                    script.setAttribute('type', "module");
                    // script.setAttribute("src", url);
                    script.innerHTML = code;
                    document.body.appendChild(script);
                });
            }

            _eval(editor.getValue()
                .replaceAll("from 'sky:", "from 'https://cdn.skypack.dev/")
                .replaceAll('from "sky:', 'from "https://cdn.skypack.dev/')
            )

//             import confetti from 'https://cdn.skypack.dev/canvas-confetti';
// confetti();
            // const asyncWrap = (v) => `(async () => { ${v} })()`;

            // (new Function(asyncWrap(polyfills + editor.getValue())))()
        }
        editor.addCommand(
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter
			// monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM
		, () => {
            // console.log('test')
            editor.getAction('editor.action.formatDocument').run()
            exec()
        });



        editor.onDidChangeModelContent(e => {
            if (skipWatch) return;
            console.log(e)
            let value = editor.getValue()
            let state = editor.saveViewState()
            let options = editor.getRawOptions()
            // v = stringify(v);
            // console.log(editor.saveViewState())
        // editor.getContribution
            localStorage.setItem('model', JSON.stringify({
                state, value, options
            }));
        })

    })
</script>

<div bind:this={container}></div>

<style lang="scss">
    div {
        position: relative;
        height: 100%;
    }
</style>
