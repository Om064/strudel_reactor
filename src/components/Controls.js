import React, { useState } from "react";

export default function Controls({
    onRadioChange,
    onSaveJson,
    onLoadJson,
    onTempoChange,
    onVolumeChange
}) {
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        onSaveJson();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
    };

    return (
        <>
            <div
                className={`toast position-fixed top-0 end-0 m-3 bg-success text-white ${showToast ? "show" : "hide"}`}
                role="alert"
                style={{ zIndex: 9999 }}
            >
                <div className="toast-body fw-semibold">
                    JSON Saved Successfully!
                </div>
            </div>

            <div className="card shadow-lg rounded-4">
                <div className="card-body">
                    <h4 className="card-title mb-3 fw-bold text-primary">
                        Control Panel
                    </h4>

                    <div className="accordion" id="controlsAccordion">

                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#playbackSection"
                                >
                                    Playback Controls
                                </button>
                            </h2>

                            <div
                                id="playbackSection"
                                className="accordion-collapse collapse show"
                            >
                                <div className="accordion-body">

                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        <button id="process" className="btn btn-outline-primary flex-fill">
                                            Preprocess
                                        </button>
                                        <button id="process_play" className="btn btn-primary flex-fill">
                                            Proc & Play
                                        </button>
                                        <button id="play" className="btn btn-success flex-fill">
                                            Play
                                        </button>
                                        <button id="stop" className="btn btn-danger flex-fill">
                                            Stop
                                        </button>
                                    </div>

                                    <div className="d-flex flex-wrap gap-2">
                                        <button id="saveJsonBtn" className="btn btn-outline-secondary flex-fill" onClick={handleSave}>
                                            Save Script
                                        </button>
                                        <button id="loadJsonBtn" className="btn btn-outline-secondary flex-fill" onClick={onLoadJson}>
                                            Load Script
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#soundSection"
                                >
                                    Sound Settings
                                </button>
                            </h2>

                            <div
                                id="soundSection"
                                className="accordion-collapse collapse"
                            >
                                <div className="accordion-body">

                                    <label className="form-label mt-2 fw-semibold">
                                        Tempo (BPM)
                                    </label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="60"
                                        max="180"
                                        defaultValue="120"
                                        onChange={(e) => onTempoChange(e.target.value)}
                                    />

                                    <label className="form-label mt-3 fw-semibold">
                                        Volume
                                    </label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        defaultValue="0.8"
                                        onChange={(e) => onVolumeChange(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#patternSection"
                                >
                                    Pattern Controls
                                </button>
                            </h2>

                            <div
                                id="patternSection"
                                className="accordion-collapse collapse"
                            >
                                <div className="accordion-body">

                                    <div className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="p1On"
                                            onChange={onRadioChange}
                                        />
                                        <label className="form-check-label" htmlFor="p1On">
                                            p1 : ON
                                        </label>
                                    </div>

                                    <div className="form-check mb-1">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="p1Hush"
                                            onChange={onRadioChange}
                                        />
                                        <label className="form-check-label" htmlFor="p1Hush">
                                            p1 : HUSH
                                        </label>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}
