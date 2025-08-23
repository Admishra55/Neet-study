import { useState, useEffect } from 'react';

export default function useGoogleSheet() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sheetId = params.get('sheetId');
    const sheetName = params.get('sheetName') || 'Sheet1';

    if (!sheetId) {
      alert('Missing sheetId in URL');
      setLoading(false);
      return;
    }

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    fetch(url)
      .then(res => res.text())
      .then(text => {
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows.map(r =>
          json.table.cols.reduce((acc, col, i) => {
            acc[col.label] = r.c[i] ? r.c[i].v : '';
            return acc;
          }, {})
        );
        setData(rows);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
