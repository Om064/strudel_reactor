import React from 'react';

export default function Controls({ onRadioChange }) {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Instrument Controls</h5>

                <div className="form-check mb-2">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="p1Radio"
                        id="flexRadioDefault1"
                        defaultChecked
                        onChange={onRadioChange}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                        p1: ON
                    </label>
                </div>

                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="p1Radio"
                        id="flexRadioDefault2"
                        onChange={onRadioChange}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                        p1: HUSH
                    </label>
                </div>

                <hr className="text-secondary" />

                {/* Placeholders for future controls */}
                <div className="mb-2">
                    <label className="form-label">Tempo (BPM)</label>
                    <input type="number" className="form-control" placeholder="120" />
                </div>

                <div className="form-check mb-2">
                    <input type="checkbox" className="form-check-input" id="fxEcho" />
                    <label className="form-check-label" htmlFor="fxEcho">Echo</label>
                </div>

                <div className="mb-2">
                    <label className="form-label">Volume</label>
                    <input type="range" className="form-range" min="0" max="100" defaultValue="60" />
                </div>

                <div className="mb-1">
                    <label className="form-label">Preset</label>
                    <select className="form-select">
                        <option>Default</option>
                        <option>Preset A</option>
                        <option>Preset B</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
