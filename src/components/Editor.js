import React from 'react';

export default function Editor({ initialValue }) {
    return (
        // Card container for the script editor
        <div className="card">
            <div className="card-body panel-scroll">
                <h5 className="card-title">Editor</h5>

                {/* Textarea where the Strudel script is written and edited */}
                <textarea
                    className="form-control"
                    id="proc"
                    rows="15"
                    defaultValue={initialValue}
                />
            </div>
        </div>
    );
}
