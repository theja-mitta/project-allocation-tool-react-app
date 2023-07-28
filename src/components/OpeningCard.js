import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const OpeningCard = ({ opening }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{opening.title}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Skills: {opening.skills.join(', ')}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Level: {opening.level}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Location: {opening.location}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OpeningCard;
