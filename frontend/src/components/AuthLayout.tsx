import { Grid, Box } from "@mui/material";
import React from "react";
import logo from '../assets/logo1.png';
interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayoutComponent(props: AuthLayoutProps){
  const { children } = props;

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      <Grid size={{xs:false, md:6}}
        
        sx={{
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#431022'
        }}
      >
        <Box
          sx={{
            width: '70%',
            maxWidth: '400px',
            aspectRatio: '19/10',
            borderRadius: '50%',
            backgroundColor: 'background.default',
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
            filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.3))',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        >
          <Box
            component='img'
            src={logo}
            sx={{
              width: '80%',
              maxWidth: '400px',
              objectFit: 'contain',
              boxShadow: "none"
            }}
          />
        </Box>
      </Grid>

      <Grid size={{xs:12, md:6}}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
          p: 4
        }}
      >
        <Box
          component='img'
          src={logo}
          sx={{
            display: { xs: "flex", md: 'none' },
            width: '60%',
            maxWidth: '250px',
            minWidth: '100px',
            filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.3))',
            m: 5,
            boxShadow: "none"
          }}
        />
        
        <Box sx={{ width: '100%', maxWidth: '400px', alignItems: "center" }}>
          {children}
        </Box>
      </Grid>
    </Grid>
  );
}
