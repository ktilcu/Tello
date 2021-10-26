import React from 'react';
import { connect } from 'react-redux';
import styled from 'react-emotion';

import { COLORS, UNIT, UNITS_IN_PX } from '../../constants';
import { clearReduxData } from '../../helpers/local-storage.helpers';
import {
  uploadImport as ui,
  addShowsRequest as asr,
  markEpisodesAsSeen as meas,
} from '../../actions';
import { getUser } from '../../reducers/auth.reducer';

import Button from '../Button';
import Heading from '../Heading';
import Spacer from '../Spacer';
import Paragraph from '../Paragraph';

const SettingsView = ({ user, addShowsRequest, markEpisodesAsSeen }) => {
  const handleChange = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = e => {
      addShowsRequest({
        shows: Object.values(JSON.parse(e.target.result).trackedShows),
      });
      Object.values(JSON.parse(e.target.result).trackedShows).map(show => {
        return markEpisodesAsSeen({
          demo: false,
          showId: show.id,
          showName: show.name,
          episodeIds: show.seenEpisodeIds,
        });
      });
    };
  };

  return [
    <Spacer key="spacer" size={UNIT * 4} />,
    <Section key="account">
      <Heading theme="vibrant" size="small">
        Account Settings
      </Heading>
      <Paragraph>
        Logged in as <strong>{user.name}</strong> (<em>{user.email}</em>).
      </Paragraph>

      <Button href="/logout" onClick={clearReduxData} color="red" size="small">
        Log Out
      </Button>
    </Section>,
    <Section key="import">
      <Heading theme="vibrant" size="small">
        Import Backup
      </Heading>
      <Paragraph>
        Got that backup handy? Upload it here to set up all the shows you had
        before!
      </Paragraph>
      <input type="file" onChange={handleChange} />
    </Section>,
    <Section key="notifications">
      <Heading theme="vibrant" size="small">
        Notification Settings
      </Heading>
      <Paragraph>Coming soon!</Paragraph>
    </Section>,
  ];
};

const Section = styled.div`
  padding: ${UNITS_IN_PX[1]};
  margin-bottom: ${UNITS_IN_PX[1]};
  background: ${COLORS.white};
  color: ${COLORS.gray.veryDark};

  &:last-child {
    margin-bottom: 0;
  }
`;

const mapStateToProps = state => ({
  user: getUser(state),
  addShowsRequest: asr,
  markEpisodesAsSeen: meas,
});

const mapDispatchToProps = { addShowsRequest: asr, markEpisodesAsSeen: meas };

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
