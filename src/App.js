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

let globalEditor = null;

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

    const xScale = d3.scaleBand()
        .domain(dataset.map((d, i) => i))
        .range([40, w - 10])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.y)])
        .range([h - 30, 10]);

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d.y))
        .attr("width", xScale.bandwidth())
        .attr("height", d => (h - 30) - yScale(d.y))
        .attr("fill", "#58a6ff")

    svg.append("g")
        .attr("transform", `translate(0,${h - 30})`)
        .call(d3.axisBottom(xScale).tickFormat(i => i));

    svg.append("g")
        .attr("transform", "translate(40,0)")
        .call(d3.axisLeft(yScale));
};

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



export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        console.log(globalEditor)
        Proc()
        globalEditor.evaluate();
    }
}

export function Proc() {

    let proc_text = document.getElementById('proc').value
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    ProcessText(proc_text);
    globalEditor.setCode(proc_text_replaced)
}

export function ProcessText(match, ...args) {

    let replace = ""

    const p1On = document.getElementById("p1On");
    const p1Hush = document.getElementById("p1Hush");

    if (p1On && p1On.checked) replace = "";
    if (p1Hush && p1Hush.checked) replace = "_";

    return replace
}

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

    const handleSaveJson = () => {
        const content = document.getElementById('proc').value;
        const blob = new Blob([JSON.stringify({ content })], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'strudel_code.json';
        link.click();
    };

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

    const handleTempoChange = (bpm) => {
        
    };

    const handleVolumeChange = (value) => {
        
    };


    const handlePresetChange = (preset) => {
        
    };
    

return (
    <>
        <div id="preRender" />

        <div className="container-fluid py-4 px-3 px-md-5">
            <h2 className="text-center fw-bold mb-4 text-primary">🎵 Strudel Demo</h2>

            <div className="row g-4 align-items-start">
                <div className="col-lg-8">
                    <Editor initialValue={stranger_tune} />
                    <REPLView />
                </div>

                <div className="col-lg-4">
                    <Controls
                        onRadioChange={ProcAndPlay}
                        onSaveJson={handleSaveJson}
                        onLoadJson={handleLoadJson}
                        onTempoChange={handleTempoChange}
                        onVolumeChange={handleVolumeChange}
                        onPresetChange={handlePresetChange}
                    />
                </div>
            </div>
        </div>
    </>
);


}