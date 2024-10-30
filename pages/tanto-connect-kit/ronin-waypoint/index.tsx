import React, { FC } from 'react';

import RoninWaypoint from '../../../src/tanto-connect-kit/components/connectors/ronin-waypoint/RoninWaypoint';
import Layout from '../../../src/tanto-connect-kit/components/layout/Layout';

const RoninWaypointPage: FC = () => {
  return (
    <Layout>
      <RoninWaypoint />
    </Layout>
  );
};

export default RoninWaypointPage;
