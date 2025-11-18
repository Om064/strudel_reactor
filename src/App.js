import './App.css';
import { useEffect, useRef } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import Controls from './components/Controls';
import REPLView from './components/REPLView';
import Editor from './components/Editor';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Global reference to the Strudel editor instance
let globalEditor = null;

/**
 * Handles custom D3 events coming from console-monkey-patch.js.
 * This renders the bar chart based on pattern density data emitted from Strudel. 
 */
const handleD3Data = (event) => {
    console.log(event.detail);
    const dataset = event.detail;

    const graph = d3.select("#d3graph");
    graph.selectAll("*").remove();

    const w = 500;
    const h = 200;

    const svg = graph.append("svg")
        .attr("width", w)
        .attr("height", h)

    // X-axis scale uses index of dataset
    const xScale = d3.scaleBand()
        .domain(dataset.map((d, i) => i))
        .range([40, w - 10])
        .padding(0.2);

    // Y-axis scale uses y-value of each datapoint
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.y)])
        .range([h - 30, 10]);

    // Draw bars
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d.y))
        .attr("width", xScale.bandwidth())
        .attr("height", d => (h - 30) - yScale(d.y))
        .attr("fill", "#58a6ff")

    // Bottom axis
    svg.append("g")
        .attr("transform", `translate(0,${h - 30})`)
        .call(d3.axisBottom(xScale).tickFormat(i => i));

    // Left axis
    svg.append("g")
        .attr("transform", "translate(40,0)")
        .call(d3.axisLeft(yScale));
};

/**
 * Connects Play / Stop / Process buttons to Strudel editor.
 * These buttons use classic DOM event listeners (not React-based).
 */
export function SetupButtons() {

    document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
    document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
    document.getElementById('process').addEventListener('click', () => {
        Proc()
    }
    )
    document.getElementById('process_play').addEventListener('click', () => {
        if (globalEditor != null) {
            Proc()
            globalEditor.evaluate()
        }
    }
    )
}


/**
 * Runs Preprocess and Play together.
 */
export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        console.log(globalEditor)
        Proc()
        globalEditor.evaluate();
    }
}

/**
 * Preprocess function:
 * - Reads the content from the editor textarea (#proc)
 * - Replaces any <p1_Radio> tokens based on checkbox state
 * - Injects result into Strudel editor
 */
export function Proc() {

    let proc_text = document.getElementById('proc').value
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    globalEditor.setCode(proc_text_replaced)
}

/**
 * Returns either "" or "_" based on ON/HUSH checkbox state.
 * "_" = TidalCycles rest symbol → silence the pattern.
 */
export function ProcessText(match, ...args) {

    let replace = ""

    const p1On = document.getElementById("p1On");
    const p1Hush = document.getElementById("p1Hush");

    if (p1On && p1On.checked) replace = "";
    if (p1Hush && p1Hush.checked) replace = "_";

    return replace
}

/**
 * Main Strudel Demo React component.
 * Initializes the editor, audio engine, hotkeys, JSON save/load,
 * and connects UI controls to Strudel functions.
 */
export default function StrudelDemo() {

const hasRun = useRef(false);

useEffect(() => {

    if (!hasRun.current) {
        document.addEventListener("d3Data", handleD3Data);
        console_monkey_patch();
        hasRun.current = true;
        //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
            
        document.getElementById('proc').value = stranger_tune
        SetupButtons()
        Proc()
    }

}, []);

    /**
     * Hotkeys for Play / Stop / Preprocess / Load / Save.
     * These work globally on the window.
     */
    useEffect(() => {
        const handleHotkeys = (e) => {
            // Space = Play
            if (e.code === "Space" && !e.shiftKey) {
                e.preventDefault();
                document.getElementById("play")?.click();
            }

            // Shift+Space = Stop
            if (e.code === "Space" && e.shiftKey) {
                e.preventDefault();
                document.getElementById("stop")?.click();
            }

            // Enter = Process & Play
            if (e.code === "Enter" && !e.ctrlKey) {
                e.preventDefault();
                document.getElementById("process_play")?.click();
            }

            // P = Preprocess
            if (e.key.toLowerCase() === "p") {
                document.getElementById("process")?.click();
            }

            // S = Save JSON
            if (e.key.toLowerCase() === "s" && e.ctrlKey === false) {
                e.preventDefault();
                document.getElementById("saveJsonBtn")?.click();
            }

            // L = Load JSON
            if (e.key.toLowerCase() === "l") {
                e.preventDefault();
                document.getElementById("loadJsonBtn")?.click();
            }

            // 1 = Toggle p1:ON
            if (e.key === "1") {
                const box = document.getElementById("p1On");
                if (box) {
                    box.checked = !box.checked;
                    box.dispatchEvent(new Event("change", { bubbles: true }));
                }
            }

            // 2 = Toggle p1:HUSH
            if (e.key === "2") {
                const box = document.getElementById("p1Hush");
                if (box) {
                    box.checked = !box.checked;
                    box.dispatchEvent(new Event("change", { bubbles: true }));
                }
            }
        };

        window.addEventListener("keydown", handleHotkeys);

        return () => {
            window.removeEventListener("keydown", handleHotkeys);
        };
    }, []);

    /**
    * Saves current editor script as a JSON file.
    */
    const handleSaveJson = () => {
        const content = document.getElementById('proc').value;
        const blob = new Blob([JSON.stringify({ content })], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'strudel_code.json';
        link.click();
    };

    /**
    * Loads a saved JSON script and injects it into the editor.
    */
    const handleLoadJson = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.content) {
                        document.getElementById('proc').value = data.content;
                        Proc();
                    }
                } catch (err) {
                    console.error('Invalid JSON:', err);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    /**
    * Adjusts tempo by updating the first line of the script:
    * setcps(bpm/60/4)
    */
    const handleTempoChange = (bpm) => {
        const editor = document.getElementById("proc");
        if (!editor) return;

        const content = editor.value.split("\n");

        if (content[0].trim().startsWith("setcps(")) {
            content[0] = `setcps(${bpm}/60/4)`;
        }

        editor.value = content.join("\n");

        ProcAndPlay();
    };


    const handleVolumeChange = (value) => {
        
    };

    /**
    * Reverb effect handler — kept as-is with no modifications.
    */
    const handleReverbChange = (value) => {
        const editor = document.getElementById("proc");
        if (!editor) return;

        let script = editor.value;
        const reverbValue = (parseFloat(value) * 10).toFixed(1);

        script = updateEffectInBlock(script, "bassline", "room", reverbValue);
        script = updateEffectInBlock(script, "main_arp", "room", reverbValue);
        script = updateEffectInBlock(script, "drums", "room", reverbValue);
        script = updateEffectInBlock(script, "drums2", "room", reverbValue);

        editor.value = script;
        ProcAndPlay();
    };


    /**
    * Utility helper for effect insertion inside a block.
    * Removes previous instances and inserts new effect line.
    */
    function updateEffectInBlock(script, blockName, effectName, value) {
        let lines = script.split("\n");

        let inside = false;
        let soundLineIndex = -1;

        for (let i = 0; i < lines.length; i++) {
            const l = lines[i].trim();

            if (l.startsWith(blockName + ":")) {
                inside = true;
                continue;
            }
            if (inside && l.endsWith(":")) {
                inside = false;
            }
            if (!inside) continue;

            // Remove old effect lines
            if (l.startsWith(`.${effectName}(`)) {
                lines.splice(i, 1);
                i--;
                continue;
            }

            // Locate .sound(...) line
            if (l.startsWith(".sound(")) {
                soundLineIndex = i;
            }
        }

        // Insert effect after sound()
        if (soundLineIndex !== -1) {
            lines.splice(soundLineIndex + 1, 0, `  .${effectName}(${value})`);
        }

        return lines.join("\n");
    }



return (
    <>
        {/* Required placeholder div used by Strudel before rendering */}
        <div id="preRender" />

        <div className="container-fluid py-4 px-3 px-md-5">
            <h2 className="text-center fw-bold mb-4 text-primary">🎵 Strudel Demo</h2>

            {/* Main layout: editor on the left, controls on the right */}
            <div className="row g-4 align-items-start">
                {/* Code editor + evaluation output */}
                <div className="col-lg-8">
                    <Editor initialValue={stranger_tune} />
                    <REPLView />
                </div>

                {/* Control panel for playback, tempo, reverb, etc. */}
                <div className="col-lg-4">
                    <Controls
                        onRadioChange={ProcAndPlay}          // p1 ON / HUSH toggle
                        onSaveJson={handleSaveJson}          // export script
                        onLoadJson={handleLoadJson}          // import script
                        onTempoChange={handleTempoChange}    // updates setcps()
                        onVolumeChange={handleVolumeChange}  // placeholder
                        onReverbChange={handleReverbChange}  // updates .room()
                    />
                </div>
            </div>
        </div>
    </>
);


}