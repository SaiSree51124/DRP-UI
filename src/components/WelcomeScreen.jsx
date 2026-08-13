import React, { useState } from "react";
import { Target, FlaskConical, X, Plus, Check, Diamond } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FONT = "'Inter', sans-serif";
const TEAL = "#0ABFBC";
const DARK = "#0F172A";
const SUB = "#475569";
const BORDER = "#E2E8F0";

/* ── Specialty chips for Step 3 ────────────────────────────────── */
const SPECIALTIES = [
  { label: "Oncology / Cancer", defaultOn: true },
  { label: "Neurodegenerative (Alzheimer's, Parkinson's)", defaultOn: false },
  { label: "Diabetes", defaultOn: true },
  { label: "Cardiovascular Systems", defaultOn: false },
  { label: "Immunology & Inflammation", defaultOn: false },
  { label: "Infectious Viruses", defaultOn: false },
];

const INITIAL_SEARCH_TAGS = ["Type 2 Diabetes", "Oncology", "Rare Diseases"];

/* ── Shared card style ──────────────────────────────────────────── */
const CARD = {
  background: "#fff",
  border: `1px solid ${BORDER}`,
  borderRadius: "16px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  boxShadow: "0px 2px 10px rgba(15,23,42,0.06)",
  boxSizing: "border-box",
};

/* ── Background — the actual Figma-exported glow artwork, inlined as a
   compressed WebP data URI so the artifact stays a single file. ───── */
export const BG_IMAGE = "data:image/webp;base64,UklGRg4WAABXRUJQVlA4IAIWAACwWAGdASoUBZwDPlEkj0cjoaEhIHBIkHAKCWlu/A+w7S8P4vr5D79iFnC8//jdf9/3m9kv/H8xppTxqt1c/3Eryv+2mjX4B/u5GEty0B5/09gADxdqZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPamQYXYCZLtog834s9qZCbPamQmz2pkJs9qZCbPamQmz2pkJs9qZCbPMYNzMCnHBdawNrGZniz2pkJs9qZCbPamQmz2pkJs9m3M5OmNniz2pkJs9qZBZgMHcvNqb0p/HtTITZ7UyE2e1MhLjBLEq8o+cD5ilI1NcqyY2Bj2hgc7ASiSltgpnCKezxZ7UyE2ZoBjcfwyVll08TITZ7UyE2e1LZgzAIPBQRzxmFoqZt8S2jQBgd/9etJ16Oae+Otj9LBUTd9TXxEHm/FnmjdabWNZsmDnFvYcZzqZCbPamQlaAgjgo4l45noSCkbQCOXqKT/GALXJAOfIEBf76mviIPN+GIFlC2mhL5Go/s2hNntTITZmgex6+At+LPamQmslL/L0qdaZ9eyIa5bFyYI8tVXB6mQmz2pkJrFQ8Np2rJVnxES2zITZ7UtmBh+ALPamQmz2pjZBNg+vsLoNbzcc2yNEHxZ7UyE2ey325R5J46mbP9AtkZvxZ7UtvbsXA+6E2e1MhNntQG2/B4MSKcf9EUkiuUIRT2eLPalt31ZKA7tmbq7zWeLPalswmgr+knJregps9qZCbPZgHgrFTPJG91LyFpBZ7UyE2e1Lfvsgj9f1n52rff76mvMguB93Sm7tTITZ7UyC+qnaeiPjOsYTaCt7dqZCbPamNwrKN6TWXZg9kcGjHGtXamNqg+IIe1ntTITZ759CbPalwMuH1I7I+bqxAf9Z7UyE2eYwvJCJdP7SJbwAjaVZcYizxZ5jC8qa+Ig8343tKNvbB4eInepJQiiHdzs7rbMhNnssw/NVboAEBBochFxPI2eLPNTk5L6mviIPZitntTITnGjGrHr3n0JX7207ZssV18RB5f2ZXOGTRMMu+PnxEHm+kwz7UyE2e2VPmviLh7PFmgisX30rZZkhsuAhpC3QhFPZNPpD03AB9MUIp7PFZYT1wUIp7PFntTITZ7iSz2raXEdQ1r13c9Cw4YeCEIp7JsEvNsw0HLzfiz2Ynt5m1MhNulZkJs9qZCbPamT6j6611bgIE7VNfTDmFd9nxEHm+k0sg80nrmorNBZ5tXamQW7Pl6NdMbPFntTITbuSXfh0pu7UyFiPamQmzNUtsyE1mFe0czBlp18RB5uYUly34s9qZCbPhNEJs9qZGof2pkah/amQrlCDT8HxZ7T9DlMuIasKtiIPN+KygMfktvxKa+Ig834s9qZCbPamQnT0op7REz2pkFnd3yZCbPamQmz2pkJszd2nBrxuIp7PFnwd0Js9qZCbPaok34dPZ4s9rzoX3oTZ7UyE2e1MhNmaV8/vCKmdT2eLPamQmz2pkJs98+hOkEQeb+mGa+Ig834s9qZCbM0ELDeutmQmz2pkKTftlWDzAs9qZCxHtUOTXxFkoLains8We1MhNntQDMudTITZ84834s+E0Qmz3XDeNnjSCIPN+LPf6sHqZCbPafhQ/DHpqDCPB+KdVElNRXE1d8RLsO+YUIRUzqezxZ7UyE2e1MhOkEQeb8WgivQmzP1HQhFPZIMPsEKLx7lSmFyRGWYSTMqarQbo5XqGb8We1MhUR4tCVehNntTL4+8tnvn0Js9qZGW3Iamz2pjYSHkrIbz18cp+LBoqax9EfIfDJzEHX9fGzxZ7UyE2e1MhNphyxHtTITaCK9CbYLnk6n6Y2dIoDKHDsKJ1SwcfM4BaAx8dXQzezryqHQnGE2f3hFPZ4s9qZCdIIhDE8We1MhNntTILSWGym5aG7B5gcDs8ewiJ7zw3lGi89qZCbPamQmz2pkJs9qZGZntTITZ7UyE2e1MbDqYT4IGLHXL/GhOr4hm9uY0ybBUPN1qKezxvc4GpkJs9qZGZnvn0Js9qZCayt8Sjq+W4RC+EjEVMbx/oh3xSv7WumNnkFCKwEJs9qZCbZezITZ7UyE2y9mQW1+R8AMzwUMs12gPFETHLUnsLPFn94Re/31NxpuNN90RT2SQRzzjHEnozDYF2UF6E2e1MhNmcfrzz/WB4PEIVo2cZzqZCbPamXxs8We2Ai21/wmsMA8HVAHmbT8kz07nUyFiPalt5p4EsF7NLo2gD8KfU15S+bUyFRHi1YN3/JamQm1YEIO4IAOFIUWYdtgVq7PFntTILhogZAVOH64/frZ7UINCavBAoHpi84CX9av3hFPcyWeameX1t94ClVgxcGeE2e+fQmzPPgGLKiQ69/v46E4kwep5VMvjZ5iUdCKTEQec0zcs9gos3hFtICP71LJmgUcLZ7UyE2ZjUHIw4CX+abBUN8Ag8znIFBAoHnNM34xhNntf8JrNxg7wvPGaG7BhIKSBwTaCK9CawwDXGFcomMLgfRCJNUxYLM2KSHN+YjxjCbVgQins8xIJb8LdMuY2og/CE2Z3wD61zqZCbPafhWjmeQkz4s+DiWhRZRDhCM8Fs91qQuj99TiPEXxKQxPFmck5uehkMNwVwefamQmz2pkFiuPupPxw1252rs8bKvBOckWnZp4jxZ/eEXwEaqbyf7U8qmQmzOSceuz2/HcvR8rXoTZ7UyE2aIJOJtttmH7Ou65ZGABM08e9//wge9WUzZ7WumO5ecBLfiz2pkJs9lq4BjMsXIUZrgAORAlZ2+1MhNntTITaRz2jjuGAdO0CUhqBNtBehNn94Re/312DAFs9qZCbPNKiwoRNM71WaCU8zamQmz2pkJs9qZCawwWyPF1dbwi9/vrsFTXxEHm/FmaCOED1tHLMwT4KBR234s9qZCbPamQmz2pjdR1vxZ/eEVM6nt0zfiz2pkJs8yBsi3+bB6RQsZLMQ+7u6lwzgRB5vxZ7UyE2ZoSUNdMcNdAm1YEIqZ1PZ4s9qZCawwx/WzqC8LRwo51PZNFN0yE2e1MhNntTIVEeLPdain3LzfjGE2e1MhNntP6beb4ivdU/0mKsth1zqZBeNvqa+Ig834s9qWzvaY2o6d6+J/dqZE2YvN+YjxZ7U3E9fdFcRB5vwtXe+bUyE2e1MhNnmQN0m0Js91qKfcvN+LPamQmz2pkJs9qZCbPafp0yE2e1MhNntTITWHJTPiz3Wop7dM34s9qZCbPamQmz2pkJs9qAYu1MhNntTITZ7UxsgLg62ZCcYTZ7rUU9niz2pkJs9qZCbPamQlabv5kJs9qZCbPamQmsOSmfFnta6Y2eYjxZ7UyE2e1MhNntTITZmgjV2eLPamQmz2pkJs9lnVtRT2eYjxfV12Cpr4iDzfiz2pkJs9qXCIRB5vxZ7UyE2e1MhNYYamcIqGyAlvxZ7Uy+c+siDzfiz2pkJs83eMHp+AA/vXQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFiU6tu5U0kz3PtWQ2AAAAAAAiio7phH9T+d2FuTPvVySAh0GXzABCDcDQ27SxGVqFYtwAABERdEAB3DkhaIH2M5Z+U/34D3B/sTO3Jx/q6rcpk0ADQ7+eDJTPU5C4dzFSgobRFP4Oi3AUvNKpDgJILDZLuCEJFoNpB58oc6qTsJ7l2IeuByt2zm966QV0N3hjws5SaJsJEAkTB57ZD+x6r7QsY5ZUxXG6mHs0BcLyZDXDRoIAwmQJH0r4HPnakVV9aNeqocNhex4Xdi6XJJ9FqFuJcCZYnAVGeF7KYQsWQQYZsN3N4rmJ7GYm0kZBCppQQ5DEAUHslixsK/u6B6tXzNuHTe3rFPgVlgoAQpUd95928I3daLkwquUJRqA7qZRDFNAD4NwcrtBOm3QdgCN1RDSoB7+IeEadNm0kMdXIkr5FNwOXiByqhA/bjd0eAuYtBNkEUghD62qQcd8TMDnfUAGxPC9kpkAd0+R54xzAGtozacQwDyN8DSSnkw4SSbbLrAanL77sjAqWHdeLRCavyuynQVoWk9EtGEBmrI8hbpGU64awDaC3p4stmW8AApQ7y7gCsGQvFFEWzCSgfp1JYR777rwWAAMK7gg5lN+JmJYjtBpuOsyWmS6pZJmAKTg9yhIPAs7SKMTEBtyhQZyClH5MQlANF8ilGiSkogxl0HRCmiy/1aMsQgaLzSmG0o82vVpliJ0H4oEndkzCEErO+GsW/enMm/gtcEIUjMRVvptFkwAQuJOY3JxJF+xPUtqPEjKH2IeAD8HM387tI7auXkjaeMLpC0jQnG/MMcICjM9npU1MmcMnOm07IabSm0P/UsFmBN2gUWwI542ISGSoNe956naZ0PdFGyGAD5CJx6pULakvrZOmXYsCVt+Eufz7hZ6H98Ksa8Tf+ORGvWBuIC30k3ysNMTWldcnEZfn6GgbGv30qD2lASV2TYeFkG6W9HRsm7WAmxvqkfwDt4tdo2JBGBDYE1iUhXOSyUgq8+h4QV6z9eWD30B3yIx3cF3/Q83zZFd8wW1dxxPq33NqxcalFmBMuDsSv7peOfLUd+ldY6zs2LcEKMOa2uXNhyZA1fL4norfL7a7MUb/ntkzp2rVE7itjb1+ES4M/DxKYO/w/U5wEF5TMfGPKLPxbV9If3oIkTqU+Hk1hdKKUehiR7cx3eflsdIZmFw24dh/7MxRadgYn570Fayzj9ozxEeVbEgvr9oUQtiMO5D6yNiRDuAFBldJ19JY2bzBRlEReTQVFL468JamJPHKuKi0jMweUlw8MKGvlEBD9Diq2ZcXWDrNbFQI4oIRhojn6jqZTbMgnARPUK6ttA3Fbsk2F0m90kc7Dqzp3BAVf3RbR4WJ/3gC8BMsrbD57cAdVxkWmETMumpRiVNxX8ePG+MXeflTAZev+voQX3gw+k7RXksIu3Xt8FTHBg6m6Nokl7dmKnhGtpP2Xx7ccpB/ruGB4sJgV1bqqB6RB34yZhyMChXd0w2QgL2JD7kwXSV8U6TFzsXSWg1zwEtNZC7quGPQXsVgEq92wC3l/VLeP4sZXh5sg7vxsMPNWmBnQx5TJYPhQO8NqLgQT7LUzYEwEKHDRpwO4Sy5IzWJHcVz8iXPjPUC8T9J2gMJS1m7DTXASx6GGw/IlwuX1sTCOdPREk57liogAEbRghCOQY/cBwZjYSl6vQg5tI69B6S4ITJMzioOPBFgE4BGy4etDMJGtu/+VIKJVnXqDEH4R2MkLB4qW+uwCmQphnetgTd7F8Dq4wqlAJXXqDY/x91xBxp7pPP3K/FPE1nUwgMfPNcJir09bpJfRYqC0G70UmjNxoi3MUqyLw2Y4qs4mxRjziPUWhcsW6tsLvVIzHFQHhAtRWHbjXU0DdvbRsDwbEaeKebq9jkxqehoIbiW67du3btyJJvI7iJ7uO/wpJYM4bqCI8xHGzR2FFuT22rNX1iP6Y+hm2+E6w/OVudXbLNaLKKXrAnpJhDqpnBFRgAa5Dzjb5yJDSHn0/IGnqEl8hcTdB6dAaBJ2iU+0gFdRXP1mrGf5GU1tDtpVRgVOK0CbkZR5bCKxcLimUnqD1fW5gzIjGFKpBm7/MtpeFSOIJH3RSSmqiV8SDB9ogP6jw9yGca6RaX+s9DoLYJ/PJ6BlEAVKhbgtXZ2roAjI3STNTPHGsDzPBlVAB5IhPLMsZvHZneKk3QVdW0h9SxQwgQZ2bElrNWO56PqYkIjcqnK39JvXuBxWDqslLTb9cHLlZQQGscOT6+BjpmVSzUjyalGZSHwd+4qVj2ty9tiFEs14ZTFpGvpfGtBoLxxolfrCkEfSYY6xXWqxFvD3JvsyenYw/CZDwwefci6gCOPkZ7G7alvTD0RJ8gHwjCx1sze50LVSmwwfViyCKEKpGdO8uU43oC0D+2P07W8N2y5QkNa84B+jYmBqKORze9EZTqt3I5l90lne1zxO1xxqqLKPrTTHs1GaWP+cEe+3sDRMSpLIBzr8LbngmkSQOEP8VOvmszpAOiYVA3xNiDuQAYgQZ4wA1nzk9f2rYGkWEM4GZWKikPWrz827aSDGQJAfuLO8awxy6Pev2e5mDpNuqgm7PICJM3keGxPHViByPsVV23dsoRznD6zO0n8jiCpZHT2wMuK2CtoyoA4gQtXrC2lQBbu7n9QcWHOWdF4vzjSCyQT1XvhHMn8Yajex0qEaMjmblkQ5iGGV5WzPDardK6WKqDj2LvALMUdm6xqKZI2M/A9Sdj9S3EwpATvEuTgxnDt1Vtvwt6owIuwgkEulIIVg72NnC9ILK8xR6vchlKmKhvbEL0Ab6khyjU5AKqXmgGrl8SQK7Z+F18l/4qkRPXbkfT6QAOqi2NKQBpkJS2RBd3/e8MJkWItugUH8B8DObZKS5U58CRmD0HlrLeqMOGvsNQ5+Tif2nP4XN7B7jxTSLmdxC2nUJIBxDamoRhCj3Cb3FiwxKyl+z/faqgqmaTf67fHZwdzzFJkKG+Z8nwCDvXqNStYsV587ACk/hNjYY8TaTkSRLKG5KQaRgE5gMTHPzm1zp7wpT2IHc5LgO7j+NsdHYGx8jHYEnkT5nah6iH6O52zB5sm3g1x81LaiByggbMUNaLkilXRzsvAmNiYGuOYPX7hCgfTEGM+SeobQ5gQZfB0Ht+YmsZydWinRenDW5QJOQbZ5cxAB0B0+WIpAyfqpdTLdyOzNpJHL0VoeIQOAACkK5vY8dxH467jCeFIoPkt/Uaop2gesBa7JofDI07TdriCkUIo4BOJJEbVx133hyGqkMSbjW4fdyZThnsc6+A4iKu8g9OgIQuteGS7dVdbtKXkKGO+vgbCToCJr/ZAK7RwSCmGkxC9iDuvk3qfacCM2tYbj44t/tYclrRnoZ/JlECnBTltYL5DdQwADDSgPVtoV9jlJG58rLEiHtnww7VuDv2qoRTzEgVPQiNAX7zX8TFwOUKd+fEbsI0vLNUsDeshwOmvnflhL1l9W4vl5GiDvyMcRfVIBiNAE6vzahuNlIGUF5qaeGjBkCoWlJl8LbmhuV09mzgnD5wwY0AJeFztdrG6XlWCAZBBituSyZ9qiAaqR8CHKyAB6qyZ5KU+e1wIpwxcuRgu9RiKlvgFsYzft06vLATYAAGpP1QsVCTEwOz4gSuUyvjA9bMNVod4KXLxaagAWCIROijSkceRA4kq4czvB5AOf+dlVeGAC+5tzVxT8X7teSKmCThnAGewqJQoO548S7eKDCAAXieFQXmIDR2VeeWGzhOuD3pmOZejp/X7tUAAAA=";

/* ── Step card heading row ──────────────────────────────────────── */
const StepHeader = ({ step, Icon }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div
      style={{
        fontFamily: FONT,
        fontSize: "10px",
        fontWeight: 700,
        color: TEAL,
        textTransform: "uppercase",
        letterSpacing: "1.2px",
      }}
    >
      Step {step}
    </div>
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: `1.5px solid ${TEAL}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={16} color={TEAL} />
    </div>
  </div>
);

/* ── Tag pill (static, read-only) ─────────────────────────────────── */
const TagPill = ({ label }) => (
  <div
    style={{
      padding: "4px 10px",
      borderRadius: "6px",
      background: "#F1F5F9",
      border: `1px solid ${BORDER}`,
      display: "inline-flex",
    }}
  >
    <span style={{ fontFamily: FONT, fontSize: "12px", color: SUB }}>{label}</span>
  </div>
);

/* ── Removable search tag ──────────────────────────────────────────── */
const SearchTag = ({ label, onRemove }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 10px",
      borderRadius: "8px",
      background: "#F1F5F9",
      border: `1px solid ${BORDER}`,
      flexShrink: 0,
    }}
  >
    <span style={{ fontFamily: FONT, fontSize: "13px", color: DARK }}>{label}</span>
    <X
      size={13}
      color="#94A3B8"
      style={{ cursor: "pointer" }}
      onClick={onRemove}
    />
  </div>
);

/* ══════════════════  WELCOME SCREEN  ══════════════════════════════ */
export default function WelcomeScreen({ userName = "Priya", onSave, onSkip }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(
    Object.fromEntries(SPECIALTIES.map((s) => [s.label, s.defaultOn]))
  );
  const [searchTags, setSearchTags] = useState(INITIAL_SEARCH_TAGS);
  const [draft, setDraft] = useState("");

  const toggle = (label) => setSelected((prev) => ({ ...prev, [label]: !prev[label] }));

  const removeSearchTag = (label) =>
    setSearchTags((prev) => prev.filter((t) => t !== label));

  const addDraftTag = (e) => {
    if (e.key === "Enter" && draft.trim()) {
      e.preventDefault();
      setSearchTags((prev) => [...prev, draft.trim()]);
      setDraft("");
    }
  };

  const handleSave = () => {
    if (onSave) onSave({ selected, searchTags });
    navigate("/dashboard/new-research");
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
    navigate("/dashboard/new-research");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #94A3B8; opacity: 1; }
      `}</style>

      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#F8FAFC",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          fontFamily: FONT,
        }}
      >
        {/* ── Decorative background artwork ───────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${BG_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            pointerEvents: "none",
          }}
        />

        {/* ── Content: 900px centred ───────────────────────────────── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "900px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* welcome-hero */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              marginBottom: "4px",
            }}
          >
            {/* iNovaPath badge chip */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "20px",
                background: "rgba(0,194,181,0.08)",
              }}
            >
              <Diamond size={11} color={TEAL} fill={TEAL} />
              <span
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: TEAL,
                  lineHeight: 1,
                }}
              >
                iNovaPath
              </span>
            </div>

            {/* Heading */}
            <div
              style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 800,
                fontSize: "42px",
                color: DARK,
                textAlign: "center",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              Welcome to iNovaPath, {userName}!
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "15px",
                color: SUB,
                textAlign: "center",
                lineHeight: 1.65,
                maxWidth: "680px",
              }}
            >
              Your AI-powered research assistant. Let's get you set up to accelerate
              therapeutic discoveries in under 2 minutes.
            </div>
          </div>

          {/* GETTING STARTED GUIDE divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0" }}>
            <div style={{ flex: 1, height: "1px", background: BORDER }} />
            <div
              style={{
                fontFamily: FONT,
                fontSize: "10px",
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                whiteSpace: "nowrap",
              }}
            >
              Getting Started Guide
            </div>
            <div style={{ flex: 1, height: "1px", background: BORDER }} />
          </div>

          {/* onboarding-steps-container */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Row: STEP 1 + STEP 2 */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {/* STEP 1 — Set Research Focus */}
              <div style={{ ...CARD, flex: "1 1 320px" }}>
                <StepHeader step={1} Icon={Target} />
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: "16px", color: DARK }}>
                  Set Research Focus
                </div>
                <div style={{ fontFamily: FONT, fontSize: "13px", color: SUB, lineHeight: 1.55 }}>
                  Identify therapeutic focus areas to customize recommendations for
                  target protein and drug repurposing algorithms.
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["Oncology", "Rare Diseases", "Neurology"].map((t) => (
                    <TagPill key={t} label={t} />
                  ))}
                </div>
              </div>

              {/* STEP 2 — Run First Analysis */}
              <div style={{ ...CARD, flex: "1 1 320px" }}>
                <StepHeader step={2} Icon={FlaskConical} />
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: "16px", color: DARK }}>
                  Run First Analysis
                </div>
                <div style={{ fontFamily: FONT, fontSize: "13px", color: SUB, lineHeight: 1.55 }}>
                  Pose natural language questions to the TxKG engine or start
                  high-throughput screening on approved drug structures.
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["TxKG Query", "Target Mapping", "SaaS Pipeline"].map((t) => (
                    <TagPill key={t} label={t} />
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 3 — Quick Start: Select Therapeutic Targets */}
            <div style={CARD}>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: "16px", color: DARK }}>
                Quick Start: Select Therapeutic Targets of Interest
              </div>
              <div style={{ fontFamily: FONT, fontSize: "13px", color: SUB }}>
                Search or select therapeutic areas to seed your home dashboard view.
              </div>

              {/* search / tag input row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "8px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "12px",
                  padding: "8px 10px",
                  background: "#fff",
                }}
              >
                {searchTags.map((t) => (
                  <SearchTag key={t} label={t} onRemove={() => removeSearchTag(t)} />
                ))}
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={addDraftTag}
                  placeholder="Add more disease areas..."
                  style={{
                    flex: 1,
                    minWidth: "160px",
                    border: "none",
                    outline: "none",
                    fontFamily: FONT,
                    fontSize: "13px",
                    color: DARK,
                    padding: "6px 4px",
                    background: "transparent",
                  }}
                />
              </div>

              {/* specialty toggle chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "4px" }}>
                {SPECIALTIES.map((s) => {
                  const on = selected[s.label];
                  return (
                    <div
                      key={s.label}
                      onClick={() => toggle(s.label)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "8px 14px",
                        borderRadius: "999px",
                        border: `1.5px solid ${on ? TEAL : BORDER}`,
                        background: on ? TEAL : "#fff",
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "background 0.14s, border-color 0.14s",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT,
                          fontSize: "13px",
                          fontWeight: 500,
                          color: on ? "#fff" : SUB,
                          lineHeight: 1,
                        }}
                      >
                        {s.label}
                      </span>
                      {on ? (
                        <Check size={13} color="rgba(255,255,255,0.9)" strokeWidth={3} />
                      ) : (
                        <Plus size={13} color={TEAL} strokeWidth={3} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* actions-row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "24px",
              marginTop: "8px",
            }}
          >
            <button
              onClick={handleSave}
              style={{
                padding: "14px 28px",
                background: TEAL,
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontFamily: FONT,
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#09ADAB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = TEAL)}
            >
              Save Focus &amp; Get Started
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontFamily: FONT, fontSize: "14px", color: SUB }}>
                Skip for now –
              </span>
              <span
                onClick={handleSkip}
                style={{
                  fontFamily: FONT,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: TEAL,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(10,191,188,0.4)",
                }}
              >
                take me to the new research task
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}