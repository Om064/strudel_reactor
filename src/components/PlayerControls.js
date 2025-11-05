import React from 'react';

export default function PlayerControls() {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Player Controls</h5>

                <div className="btn-toolbar flex-wrap" role="toolbar">
                    <div className="btn-group me-2" role="group" aria-label="Proc group">
                        <button id="process" className="btn btn-outline-primary">Preprocess</button>
                        <button id="process_play" className="btn btn-primary">Proc & Play</button>
                    </div>
                    <div className="btn-group" role="group" aria-label="Playback group">
                        <button id="play" className="btn btn-success">Play</button>
                        <button id="stop" className="btn btn-danger">Stop</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
