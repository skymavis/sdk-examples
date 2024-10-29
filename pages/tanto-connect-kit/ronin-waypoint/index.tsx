import React, { FC } from "react";

import Layout from "../../../src/tanto-connect-kit/components/layout/Layout";
import RoninWaypoint from "../../../src/tanto-connect-kit/components/connectors/ronin-waypoint/RoninWaypoint";

const RoninWaypointPage: FC = () => {
  return (
    <Layout>
      <RoninWaypoint />
    </Layout>
  );
};

export default RoninWaypointPage;
