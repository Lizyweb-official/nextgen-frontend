import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function SettingRow({ label, description, enabled, onToggle, loading, updating }) {
  return (
    <div className="admin-setting-page-row">
      <div className="admin-setting-page-info">
        <p className="admin-setting-page-label">{label}</p>
        <p className="admin-setting-page-desc">{description}</p>
      </div>
      <div className="admin-setting-page-toggle-wrap">
        {loading ? (
          <span className="admin-setting-page-status">—</span>
        ) : (
          <>
            <span className={`admin-setting-page-status ${enabled ? "admin-setting-page-status--on" : "admin-setting-page-status--off"}`}>
              {updating ? "Saving..." : enabled ? "Enabled" : "Disabled"}
            </span>
            <label className="admin-setting-page-toggle">
              <input
                type="checkbox"
                checked={enabled}
                onChange={onToggle}
                disabled={updating || loading}
              />
              <div className="admin-setting-page-toggle-track">
                <div className="admin-setting-page-toggle-thumb" />
              </div>
            </label>
          </>
        )}
      </div>
    </div>
  );
}

// Phone number Lalamove shows the driver as the pickup ("sender") contact
// when an order is assigned to it from the order-details page — not a
// toggle, so it gets its own text-input row instead of SettingRow.
function PhoneSettingRow({ label, description, value, onChange, onSave, loading, saving }) {
  return (
    <div className="admin-setting-page-row">
      <div className="admin-setting-page-info">
        <p className="admin-setting-page-label">{label}</p>
        <p className="admin-setting-page-desc">{description}</p>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {loading ? (
          <span className="admin-setting-page-status">—</span>
        ) : (
          <>
            <input
              type="tel"
              className="form-control form-control-sm"
              style={{ width: "180px" }}
              placeholder="e.g. 0123456789"
              value={value}
              onChange={onChange}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AdminSetting() {
  const [slotEnabled, setSlotEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const [lalamovePhone, setLalamovePhone] = useState("");
  const [lalamovePhoneLoading, setLalamovePhoneLoading] = useState(true);
  const [lalamovePhoneSaving, setLalamovePhoneSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API}/api/admin/site-settings/get/1`)
      .then((res) => {
        

        const contentType = res.headers.get("content-type");

        // ✅ If it's not JSON, read as text to see what came back
        if (!contentType || !contentType.includes("application/json")) {
          return res.text().then((text) => {
            throw new Error(`Expected JSON but got: ${text.substring(0, 200)}`);
          });
        }

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSlotEnabled(data.setting_value === "on");
      })
      .catch((err) => {
        console.error("Failed to fetch setting:", err);
        setError("Could not load setting.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  // ✅ Fetch current slot status from API on mount
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API}/api/admin/site-settings/get/1`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Expects { setting_value: "on" } or { setting_value: "off" }
        setSlotEnabled(data.setting_value === "on");
      })
      .catch((err) => {
        console.error("Failed to fetch setting:", err);
        setError("Could not load setting.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ✅ Fetch the warehouse phone number used as the Lalamove pickup contact
  useEffect(() => {
    setLalamovePhoneLoading(true);

    fetch(`${API}/api/admin/site-settings/get-by-name/lalamove_sender_phone`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setLalamovePhone(data.setting_value || "");
      })
      .catch((err) => {
        console.error("Failed to fetch Lalamove phone setting:", err);
      })
      .finally(() => {
        setLalamovePhoneLoading(false);
      });
  }, []);

  const saveLalamovePhone = async () => {
    if (lalamovePhoneSaving) return;
    setLalamovePhoneSaving(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/admin/site-settings/upsert-by-name/lalamove_sender_phone`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting_value: lalamovePhone.trim() }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
    } catch (err) {
      console.error("Failed to save Lalamove phone setting:", err);
      setError("Could not save the delivery partner phone number.");
    } finally {
      setLalamovePhoneSaving(false);
    }
  };

  const toggleSlot = async () => {
    if (updating) return;
    setUpdating(true);
    setError(null);

    const newValue = slotEnabled ? "off" : "on";

    try {
      const res = await fetch(`${API}/api/admin/site-settings/update/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting_value: newValue }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      setSlotEnabled(!slotEnabled);
    } catch (err) {
      console.error("Failed to update setting:", err);
      setError("Could not update setting.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="admin-setting-page">
      <div className="admin-setting-page-header">
        <h2>Site settings</h2>
        <p>Manage features and booking options for your site.</p>
      </div>

      {error && (
        <div className="admin-setting-page-error">
          {error}
        </div>
      )}

      <p className="admin-setting-page-section-label">Booking</p>
      <div className="admin-setting-page-card">
        <SettingRow
          label="Slot booking"
          description="Enable or disable slot booking functionality for users."
          enabled={slotEnabled}
          onToggle={toggleSlot}
          loading={loading}
          updating={updating}
        />
      </div>

      <p className="admin-setting-page-section-label">Delivery</p>
      <div className="admin-setting-page-card">
        <PhoneSettingRow
          label="Lalamove pickup phone number"
          description="Shown to the Lalamove driver as the warehouse contact when an order is assigned for delivery."
          value={lalamovePhone}
          onChange={(e) => setLalamovePhone(e.target.value)}
          onSave={saveLalamovePhone}
          loading={lalamovePhoneLoading}
          saving={lalamovePhoneSaving}
        />
      </div>
    </div>
  );
}

export default AdminSetting;