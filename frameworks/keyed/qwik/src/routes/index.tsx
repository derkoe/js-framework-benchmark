import { $, component$, Signal, useSignal, useStore } from "@builder.io/qwik";

type DataEntry = { id: number; label: string };
type State = { items: DataEntry[]; selected: number | null };

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max: number) { return Math.round(Math.random() * 1000) % max; };

function buildData(count: number) {
  let data : DataEntry[] = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
    }
  }
  return data;
}

export const Button = component$(({ id, text, fn }: any) => (
  <div class="col-sm-6 smallpad">
    <button
      id={id}
      class="btn btn-primary btn-block"
      type="button"
      onClick$={fn}
    >
      {text}
    </button>
  </div>
));

export default component$(() => {
  const data = useStore<State>({ items: [], selected: null }),
    run = $(() => (data.items = buildData(1000))),
    runLots = $(() => (data.items = buildData(10000))),
    add = $(() => (data.items = [...data.items, ...buildData(1000)])),
    update = $(() => {
      const d = data.items;
      for (let i = 0, len = d.length; i < len; i += 10) {
        d[i].label = d[i].label + " !!!";
      }
      data.items = d.slice();
    }),
    swapRows = $(() => {
      const d = data.items.slice();
      if (d.length > 998) {
        let tmp = d[1];
        d[1] = d[998];
        d[998] = tmp;
        data.items = d;
      }
    }),
    clear = $(() => (data.items = [])),
    remove = $((id: number) => {
      const d = data.items;
      const idx = d.findIndex((d) => d.id === id);
      data.items = [...d.slice(0, idx), ...d.slice(idx + 1)];
    });

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Qwik Keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" text="Create 1,000 rows" fn={run} />
              <Button id="runlots" text="Create 10,000 rows" fn={runLots} />
              <Button id="add" text="Append 1,000 rows" fn={add} />
              <Button id="update" text="Update every 10th row" fn={update} />
              <Button id="clear" text="Clear" fn={clear} />
              <Button id="swaprows" text="Swap Rows" fn={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          {data.items.map((row) => {
            let rowId = row.id;
            return (
              <tr class={data.selected === rowId ? "danger" : ""}>
                <td class="col-md-1">{rowId}</td>
                <td class="col-md-4">
                  <a onClick$={() => (data.selected = rowId)}>{row.label}</a>
                </td>
                <td class="col-md-1">
                  <a onClick$={() => remove(rowId)}>
                    <span
                      class="glyphicon glyphicon-remove"
                      aria-hidden="true"
                    />
                  </a>
                </td>
                <td class="col-md-6" />
              </tr>
            );
          })}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
});
