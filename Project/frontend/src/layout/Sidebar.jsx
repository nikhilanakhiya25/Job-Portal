import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = ({ user }) => {
  return (
    <List>

      {user?.role === "candidate" && (
        <>
          <ListItem button component={Link} to="/jobs">
            <ListItemText primary="Jobs" />
          </ListItem>
        </>
      )}

      {user?.role === "recruiter" && (
        <>
          <ListItem button component={Link} to="/admin/post-job">
            <ListItemText primary="Post Job" />
          </ListItem>
        </>
      )}

    </List>
  );
};

export default Sidebar;
