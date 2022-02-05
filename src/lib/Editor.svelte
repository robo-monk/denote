<script>

    import { onMount } from 'svelte'; 
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
            language: 'markdown',
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
            let { state, value } = JSON.parse(localStorage.getItem('model'))
            // console.log('model', model)
            // editor.restoreViewState(model);
            editor.restoreViewState(state);
            editor.setValue(value)
            setTimeout(() => {
                skipWatch = false;
            }, 1000)
        }

        editor.onDidChangeModelContent(e => {
            if (skipWatch) return;
            console.log(e)
            let value = editor.getValue()
            let state = editor.saveViewState()
            // v = stringify(v);
            // console.log(editor.saveViewState())
            localStorage.setItem('model', JSON.stringify({
                state, value
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
