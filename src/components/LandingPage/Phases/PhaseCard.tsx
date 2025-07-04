import React from 'react';
import {Box, Card, CardContent, CardMedia, Grid, Typography} from '@mui/material';
import Phase1Image from "../../../assets/landing/phase_1.png";
import Phase2_1Image from "../../../assets/landing/phase_2.png";
import Phase2_2Image from "../../../assets/landing/phase_3.png";
import Phase3Image from "../../../assets/landing/phase_4.png";
import Phase4Image from "../../../assets/landing/phase_5.png";
import Phase5Image from "../../../assets/landing/phase_6.png";
import Phase6Image from "../../../assets/landing/phase_7.png";

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
    const images =
        imageUrls && imageUrls.length > 0
            ? imageUrls
            : imageUrl
                ? [imageUrl]
                : [];

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {images.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        flexWrap: 'nowrap',
                        overflowX: 'auto', // Falls sehr viele Bilder: horizontal scrollen
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
                                imageAlt ? `${imageAlt} (${phaseNumber})` : `Concept art for ${title} ${idx + 1}`
                            }
                        />
                    ))}
                </Box>
            )}

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h3" component="div">
                    {title}
                </Typography>
                <Typography variant="h4" color="text.secondary" mt={2}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

// Re-exporting for individual phase components to potentially use or extend
export const Phase1Gathering: React.FC = () => (
    <PhaseCard
        phaseNumber={1}
        title="Phase 1: Gathering Resources"
        description="Start as a humble cell in a vibrant, wobbly world teeming with life and danger. Consume plankton and microcells to grow, but beware – other players might see you as a snack or a threat! Every interaction can lead to growth, injury, or even absorption. As you evolve, so does the world, presenting new challenges and more complex resource management. It's a unique blend of Spore's evolution, Agar.io's survival, and Minecraft's resourcefulness."
        imageUrl={Phase1Image}
    />
);

export const Phase2Growing: React.FC = () => (
    <PhaseCard
        phaseNumber={2}
        title="Phase 2: Growing & Forming"
        description="Evolution is key. After gathering sufficient resources or reaching milestones, enter the evolution chamber. Here, you'll strategically add features to your creature – senses, limbs, armor, spikes, and more. This isn't a one-time event; you can revisit this phase to adapt and enhance your creature as you progress and unlock new possibilities."
        imageUrl={Phase2_2Image}
        imageUrls={[Phase2_1Image, Phase2_2Image]}
    />
);

export const Phase3Weapons: React.FC = () => (
    <PhaseCard
        phaseNumber={3}
        title="Phase 3: Creating Weapons"
        description="The same fundamental resources that fuel your creature's growth can be forged into powerful weapons. Dive into an advanced crafting system, reminiscent of Little Alchemy but with deep stat management and a World of Warcraft-esque feel for balancing your creature's innate abilities with its equipped arsenal. Every weapon choice impacts your combat style."
        imageUrl={Phase3Image}
    />
);

export const Phase4Teaching: React.FC = () => (
    <PhaseCard
        phaseNumber={4}
        title="Phase 4: Teaching Movement"
        description="This is where you become the game engineer. Define your creature's every move. Utilizing a sophisticated physics engine, you'll allocate points (earned through gathering) to parameters like gravity influence, air resistance, movement speed, and strength. Then, map these to your device's inputs. Program the exact arc of a swing, the force of a pounce, or the intricacies of a defensive stance. Your creativity in programming directly translates to your creature's effectiveness."
        imageUrl={Phase4Image}
    />
);

export const Phase5Training: React.FC = () => (
    <PhaseCard
        phaseNumber={5}
        title="Phase 5: Training"
        description="Hone your skills and test your creature's programmed abilities in a dedicated offline training mode. Face off against various AI-controlled bots across different challenge levels. This is the perfect space to experiment with new movement programs, weapon combinations, and combat strategies before heading into live battles. (More details on training mode coming soon!)"
        imageUrl={Phase5Image}
    />
);

export const Phase6Battles: React.FC = () => (
    <PhaseCard
        phaseNumber={6}
        title="Phase 6: Online Battles"
        description="The ultimate test! Engage in thrilling online battles against other players and their unique creatures. With a matchmaking system inspired by Brawlhalla and Tekken, you can expect intense 1v1 duels, chaotic 2v2 team fights, and structured tournaments. Rise through the ranks and prove your creature is the ultimate champion. It's like real-life robot fights, but with boundless creative possibilities!"
        imageUrl={Phase6Image}
    />
);

// A component to display all phases in a grid
export const AllPhasesGrid: React.FC = () => {
    const phases = [
        {component: Phase1Gathering},
        {component: Phase2Growing},
        {component: Phase3Weapons},
        {component: Phase4Teaching},
        {component: Phase5Training},
        {component: Phase6Battles},
    ];

    return (
        <Box sx={{my: 4}}>
            <Typography variant="h2" component="h2" gutterBottom sx={{textAlign: 'center', mb: 4}}>
                The Journey of a Creature
            </Typography>
            <Grid container spacing={4}>
                {phases.map((PhaseComponent, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <PhaseComponent.component/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PhaseCard;

