import React from 'react';

export default function Controls({ onRadioChange, onSaveJson, onLoadJson }) {
    return (
        <div className="card control-card shadow-sm">
            <div className="card-body">
                <h5 className="card-title mb-3">Controls</h5>

                {/* Action buttons */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                    <button id="process" className="btn btn-outline-primary flex-fill">Preprocess</button>
                    <button id="process_play" className="btn btn-primary flex-fill">Proc &amp; Play</button>
                    <button id="play" className="btn btn-success flex-fill">Play</button>
                    <button id="stop" className="btn btn-danger flex-fill">Stop</button>
                </div>

                {/* Save / Load JSON feature */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                    <button className="btn btn-outline-secondary flex-fill" onClick={onSaveJson}>
                        Save JSON
                    </button>
                    <button className="btn btn-outline-secondary flex-fill" onClick={onLoadJson}>
                        Load JSON
                    </button>
                </div>

                {/* Radio buttons */}
                <div className="form-check mb-2">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        defaultChecked
                        onChange={onRadioChange}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                        p1 : ON
                    </label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onChange={onRadioChange}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                        p1 : HUSH
                    </label>
                </div>
            </div>
        </div>
    );
}
