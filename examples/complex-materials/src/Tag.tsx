import { Logo } from '@pmndrs/branding'

export default function Tag() {
  return (
    <div className="copy">
      <span>
        <a target="_blank" href="https://github.com/pmndrs/lamina">
          <Logo />
        </a>
      </span>

      <span>
        Made with 🧡 by{' '}
        <a target="_blank" href="https://twitter.com/CantBeFaraz">
          Faraz Shaikh
        </a>
      </span>
    </div>
  )
}
