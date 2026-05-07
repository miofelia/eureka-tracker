import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { store } from '../data/userProgress'
import './SettingsView.css'

const KEYS = ['userProgress', 'userFlags', 'achievementProgress']

export default function SettingsView() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  async function handleExport() {
    const entries = await Promise.all(KEYS.map(k => store.getItem(k)))
    const data = Object.fromEntries(KEYS.map((k, i) => [k, entries[i]]))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().slice(0, 10)
    const a = document.createElement('a')
    a.href = url
    a.download = `eureka-tracker-${date}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''

    let data
    try {
      data = JSON.parse(await file.text())
    } catch {
      alert('Invalid JSON file.')
      return
    }

    if (!window.confirm('This will overwrite your current progress. Are you sure?')) return

    await Promise.all(
      KEYS.filter(k => data[k] != null).map(k => store.setItem(k, data[k]))
    )
    window.location.reload()
  }

  async function handleClear() {
    if (!window.confirm('This will delete all your progress. This cannot be undone. Are you sure?')) return
    await Promise.all(KEYS.map(k => store.removeItem(k)))
    window.location.reload()
  }

  return (
    <div className="settings">
      <div className="settings__header">
        <button className="settings__back" onClick={() => navigate('/')}>
          <img
            src="/icons/ui/back.png"
            alt="←"
            style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }}
            onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none' }}
          />
          Settings
        </button>
      </div>

      <div className="settings__sections">
        <div className="settings__card">

          <div className="settings__top-row">
            <div className="settings__col">
              <h2 className="settings__section-title">Export</h2>
              <p className="settings__section-desc">
                Download all your progress as a JSON backup file.
              </p>
              <button className="settings__btn" onClick={handleExport}>
                Export Progress
              </button>
            </div>

            <div className="settings__col">
              <h2 className="settings__section-title">Import</h2>
              <p className="settings__section-desc">
                Restore progress from a previously exported JSON file. Your current progress will be overwritten.
              </p>
              <button className="settings__btn" onClick={() => fileInputRef.current.click()}>
                Import Progress
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImport}
              />
            </div>
          </div>

          <hr className="settings__divider" />

          <div className="settings__reset">
            <h2 className="settings__section-title">Reset</h2>
            <p className="settings__section-desc">
              Permanently delete all your progress. This cannot be undone.
            </p>
            <button className="settings__btn settings__btn--danger" onClick={handleClear}>
              Clear All Progress
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
