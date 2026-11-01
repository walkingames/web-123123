import type { ReactNode } from "react";

/** A table that becomes a stack of labelled cards on narrow screens. */
export function PrivacyTable({ head, rows, label }: { head: string[]; rows: ReactNode[][]; label: string }) {
  return (
    <div className="privacy-table">
      <table role="table" aria-label={label}>
        <thead role="rowgroup">
          <tr role="row">
            {head.map((cell) => (
              <th key={cell} scope="col" role="columnheader">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((row, r) => (
            <tr key={r} role="row">
              {row.map((cell, c) => (
                <td key={c} role="cell" data-label={head[c]}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
