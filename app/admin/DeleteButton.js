'use client';

// Red delete button that asks for confirmation before submitting the server action.
export default function DeleteButton({ action, id, name, label = 'Delete', big = false }) {
  const ask = e => {
    const short = name && name.length > 70 ? name.slice(0, 70) + '…' : name;
    const what = !name ? 'this item' : name.startsWith('the ') ? short : `"${short}"`;
    if (!window.confirm(`Delete ${what}? This can't be undone.`)) e.preventDefault();
  };
  return (
    <form action={action} onSubmit={ask} style={big ? { marginTop: 32 } : { display: 'inline' }}>
      <input type="hidden" name="id" value={id} />
      <button className={`del ${big ? 'big' : ''}`} type="submit">{label}</button>
    </form>
  );
}
