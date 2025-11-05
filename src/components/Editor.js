import React from 'react';

export default function Editor({ initialValue }) {
    return (
        <div className="card">
            <div className="card-body panel-scroll">
                <h5 className="card-title">Editor</h5>
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
