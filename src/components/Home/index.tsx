/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { css } from './style'
import Animation from 'components/Firemotion/Animation'

export function Home() {
  return (
    <Animation>
      <div className={css.top_wrapper}>
        <div className={css.container}>
          <span className={css.Logo}>TypedCSSX</span>
          <p className={css.text}>Write CSS in TypeScript</p>
          <Link className={css.link1} href="/docs">
            Get Started
          </Link>
          <Link className={css.link2} href="/installation">
            Installation
          </Link>
          <p className={css.tagline}>A Type safe and stable CSS in JS on Next.js</p>
          <section className={css.card_container}>
            <div>
              <span>📡</span>
              <h2>Console lover</h2>
              <p>Compiled CSS code is directly output to the console, ensuring you never write incorrect code during development.</p>
            </div>

            <div>
              <span>🌠</span>
              <h2>Zero Runtime</h2>
              <p>Experience efficiency with zero runtime overhead, boosting performance and streamlining your workflow.</p>
            </div>
            <div>
              <span>🔭</span>
              <h2>Autocomplete</h2>
              <p>Enjoy seamless coding with advanced autocomplete, speeding up development and improving accuracy. </p>
            </div>
            <div>
              <span>🌌</span>
              <h2>Support App Router</h2>
              <p>Take full advantage of the App Router in Next.js to make the most of the latest features in React 18.</p>
            </div>
          </section>
        </div>
      </div>
    </Animation>
  )
}
