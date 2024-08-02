import Style, { max_xl } from 'typedcssx'

export const styles = Style.create({
  list: {
    zIndex: '2',
    position: 'fixed',
    top: 48,
    padding: 12,
    width: 580,
    height: 400,
    background: 'var(--color-bg)',
    border: 'solid 2px var(--color-border)',
    borderRadius: '8px',
    overflowY: 'scroll',
    left: '50%',
    transform: 'translate(-74.2%)',
    '& li': {
      listStyleType: 'none'
    },
    '& ul': {
      display: 'flex',
      flexDirection: 'column',
      rowGap: 48,
      padding: 0,
      marginTop: 40
    },
    [max_xl]: {
      left: '0',
      transform: 'translate(0)',
      width: '100%',
      height: 'calc(100% - 64px)'
    }
  },

  link: {
    textDecoration: 'none',
    color: 'var(--color-text)'
  },

  box: {
    position: 'relative',
    fontSize: 16,
    padding: '12px 20px',
    borderRadius: '8px',
    hover: {
      background: 'var(--color-list)'
    },
    '&:hover div': {
      color: 'var(--color-link)'
    }
  },

  heading3: {
    color: 'var(--color-heading)'
  },

  desc: {
    margin: 0,
    fontSize: 14
  },

  highlight: {
    color: 'var(--color-link)'
  },

  no_result: {
    textAlign: 'center'
  }
})
