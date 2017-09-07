export default function mdcDriver(sink$) {
  sink$.addListener({next: () => mdc.autoInit()})
}
