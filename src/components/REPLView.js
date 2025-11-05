import React from 'react';

export default function REPLView() {
    return (
        <div className="card">
            <div className="card-body panel-scroll">
                <h5 className="card-title">Strudel REPL Output</h5>
                <div id="editor" />
                <div id="output" />
                <canvas id="roll"></canvas>
            </div>
        </div>
    );
}
