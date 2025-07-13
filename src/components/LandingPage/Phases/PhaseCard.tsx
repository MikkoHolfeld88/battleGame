import React from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BLOG_PHASE1_PATH } from '../../../routes'; // Import the route path
import Phase1Image from "../../../assets/landing/phase_1.png";
import Phase2_1Image from "../../../assets/landing/phase_2.png";
import Phase2_2Image from "../../../assets/landing/phase_3.png";
import Phase3Image from "../../../assets/landing/phase_4.png";
import Phase4Image from "../../../assets/landing/phase_5.png";
import Phase5Image from "../../../assets/landing/phase_6.png";
import Phase6Image from "../../../assets/landing/phase_7.png";
import Phase7Image from "../../../assets/landing/phase_7.png"; // Assuming phase_7.png is also for phase 7, adjust if a new asset is provided

interface PhaseCardProps {
    phaseNumber: number;
    title: string;
    description: string;
    imageUrl?: string;
    imageUrls?: string[];
    imageAlt?: string;
}

const PhaseCard: React.FC<PhaseCardProps> = ({
     phaseNumber,
     title,
     description,
     imageUrl,
     imageUrls,
     imageAlt,
 }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const images =
        imageUrls && imageUrls.length > 0
            ? imageUrls
            : imageUrl
                ? [imageUrl]
                : [];

    const handleCardClick = () => {
        if (phaseNumber === 1) {
            navigate(BLOG_PHASE1_PATH);
        }
        // Potentially handle other phase clicks here if needed in the future
    };

    const cardContent = (
        <>
            {images.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        flexWrap: 'nowrap',
                        overflowX: 'auto',
                    }}
                >
                    {images.map((src, idx) => (
                        <CardMedia
                            key={idx}
                            component="img"
                            sx={{
                                flex: '1 1 0',
                                maxWidth: `${100 / images.length}%`,
                                height: 'auto',
                                objectFit: 'contain',
                                imageRendering: 'pixelated',
                                backgroundColor: 'grey.300',
                            }}
                            image={src}
                            alt={
                                imageAlt
                                    ? t(imageAlt, { phaseNumber, title, defaultValue: `${imageAlt} (${phaseNumber})` })
                                    : t('landingPage.phases.conceptArtAlt', { title, number: idx + 1 })
                            }
                        />
                    ))}
                </Box>
            )}
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h4" component="div">
                    {title}
                </Typography>
                <Typography variant="h6" color="text.secondary" mt={2}>
                    {description}
                </Typography>
            </CardContent>
        </>
    );

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {phaseNumber === 1 ? (
                <CardActionArea onClick={handleCardClick} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    {cardContent}
                </CardActionArea>
            ) : (
                cardContent
            )}
        </Card>
    );
};

// Re-exporting for individual phase components to potentially use or extend
export const Phase1Gathering: React.FC = () => {
    const { t } = useTranslation();
    return (
        <PhaseCard
            phaseNumber={1}
            title={t('landingPage.phases.phase1.title')}
            description={t('landingPage.phases.phase1.description')}
            imageUrl={Phase1Image}
            imageAlt={t('landingPage.phases.phase1.imageAlt')}
        />
    );
};

export const Phase2Growing: React.FC = () => {
    const { t } = useTranslation();
    return (
        <PhaseCard
            phaseNumber={2}
            title={t('landingPage.phases.phase2.title')}
            description={t('landingPage.phases.phase2.description')}
            imageUrl={Phase2_2Image}
            imageUrls={[Phase2_1Image, Phase2_2Image]}
            imageAlt={t('landingPage.phases.phase2.imageAlt')}
        />
    );
};

export const Phase3Weapons: React.FC = () => {
    const { t } = useTranslation();
    return (
        <PhaseCard
            phaseNumber={3}
            title={t('landingPage.phases.phase3.title')}
            description={t('landingPage.phases.phase3.description')}
            imageUrl={Phase3Image}
            imageAlt={t('landingPage.phases.phase3.imageAlt')}
        />
    );
};

export const Phase4Teaching: React.FC = () => {
    const { t } = useTranslation();
    return (
        <PhaseCard
            phaseNumber={4}
            title={t('landingPage.phases.phase4.title')}
            description={t('landingPage.phases.phase4.description')}
            imageUrl={Phase4Image}
            imageAlt={t('landingPage.phases.phase4.imageAlt')}
        />
    );
};

export const Phase5Training: React.FC = () => {
    const { t } = useTranslation();
    return (
        <PhaseCard
            phaseNumber={5}
            title={t('landingPage.phases.phase5.title')}
            description={t('landingPage.phases.phase5.description')}
            imageUrl={Phase5Image}
            imageAlt={t('landingPage.phases.phase5.imageAlt')}
        />
    );
};

export const Phase6Battles: React.FC = () => {
    const { t } = useTranslation();
    return (
        <PhaseCard
            phaseNumber={6}
            title={t('landingPage.phases.phase6.title')}
            description={t('landingPage.phases.phase6.description')}
            imageUrl={Phase6Image}
            imageAlt={t('landingPage.phases.phase6.imageAlt')}
        />
    );
};

export const Phase7Ascension: React.FC = () => {
    const { t } = useTranslation();
    return (
        <PhaseCard
            phaseNumber={7}
            title={t('landingPage.phases.phase7.title')}
            description={t('landingPage.phases.phase7.description')}
            imageUrl={Phase7Image}
            imageAlt={t('landingPage.phases.phase7.imageAlt')}
        />
    );
};

// A component to display all phases in a grid
export const AllPhasesGrid: React.FC = () => {
    const { t } = useTranslation();
    const phases = [
        {component: Phase1Gathering},
        {component: Phase2Growing},
        {component: Phase3Weapons},
        {component: Phase4Teaching},
        {component: Phase5Training},
        {component: Phase6Battles},
        {component: Phase7Ascension},
    ];

    return (
        <Box sx={{my: 4}}>
            <Typography variant="h2" component="h2" gutterBottom sx={{textAlign: 'center', mb: 4}}>
                {t('landingPage.phases.mainTitle')}
            </Typography>
            <Grid container spacing={4}>
                {phases.map((PhaseComponent, index) => (
                    // @ts-ignore
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <PhaseComponent.component/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PhaseCard;

