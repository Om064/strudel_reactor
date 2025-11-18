import React from 'react';

export default function REPLView() {
    return (
        // Card containing all live Strudel visual outputs
        <div className="card">
            <div className="card-body panel-scroll">
                <h5 className="card-title">Strudel REPL Output</h5>
                <div id="editor" />
                <div id="output" />

                {/* Piano roll canvas drawn in real-time during playback */}
                <canvas id="roll"></canvas>

                {/* D3 graph visualisation populated via console-monkey-patch */}
                <div id="d3graph"></div>
            </div>
        </div>
    );
}
