import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withProps from 'recompose/withProps'
import Card, { CardContent } from 'material-ui/Card'
import Text from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import DescriptionIcon from 'material-ui-icons/Menu'
import MuiWarningIcon from 'material-ui-icons/Warning'
import ms from 'ms'

import DescriptionDialog from './DescriptionDialog'
import CurrentMedia from './ServerMedia'

const downTimeout = ms('10 minutes')

const enhance = compose(
  withState('isOpen', 'setDescriptionOpen', false),
  withProps(({ setDescriptionOpen }) => ({
    onOpenDescription: (event) => {
      event.preventDefault()
      event.stopPropagation()
      setDescriptionOpen(true)
    },
    onCloseDescription: () => setDescriptionOpen(false)
  }))
)

const WarningIcon = withProps({
  style: {
    height: 16,
    width: 16,
    verticalAlign: 'sub'
  }
})(MuiWarningIcon)
const WarningText = withProps({
  type: 'body1',
  style: {
    color: '#ed404f'
  }
})(Text)

const ServerThumbnail = ({
  server,
  media,
  isOpen,
  onOpenDescription,
  onCloseDescription
}) => (
  <div className='thumb'>
    <Card>
      <CardContent>
        <div className='header'>
          <div>
            <Text type='headline'>
              {server.name}
            </Text>
            <Text type='body1' secondary>
              {server.subtitle}
            </Text>
          </div>
          {server.description && (
            <IconButton onClick={onOpenDescription}>
              <DescriptionIcon />
            </IconButton>
          )}
        </div>
      </CardContent>

      <a href={server.url}>
        <CurrentMedia media={media} />
      </a>

      {server.timeSincePing >= downTimeout && (
        <CardContent>
          <WarningText>
            <WarningIcon /> This server may be down.
            It has not responded for {ms(server.timeSincePing, { long: true })}.
          </WarningText>
        </CardContent>
      )}

      {server.description && (
        <DescriptionDialog
          server={server}
          isOpen={isOpen}
          onCloseDescription={onCloseDescription}
        />
      )}
    </Card>
    <style jsx>{`
      .thumb {
        width: 360px;
        margin: 0 20px 20px 20px;
      }

      .header {
        display: flex;
        justify-content: space-between;
      }
    `}</style>
  </div>
)

export default enhance(ServerThumbnail)
