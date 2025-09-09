import Planet from './Planet';

export default function PlanetsGroup({ onPlanetClick }) {
    // keep them relatively near the camera’s corridor but at different depths
    return (
        <group>
            <Planet
                name="Projects"
                type="mars"
                label="Projects"
                radius={0.9}
                position={[ -1,  2.2, -6 ]}
                rotationSpeed={0.005}
                axialTilt={0.22}
                onClick={onPlanetClick}
            />
            <Planet
                name="Skills"
                type="saturn"
                label="Skills"
                radius={1.1}
                position={[  1.5, 3, 5 ]}
                rotationSpeed={0.006}
                axialTilt={0.32}
                ringOpts={{ innerRadius: 1.6, outerRadius: 2.5, color: '#fffcba', opacity: 0.75 }}
                onClick={onPlanetClick}
            />
            <Planet
                name="Work"
                type="ice"
                label="Work Experience"
                radius={0.95}
                position={[  -2.3,  -0.9, 8 ]}
                rotationSpeed={0.004}
                axialTilt={0.15}
                onClick={onPlanetClick}
            />
            <Planet
                name="Contact"
                type="hot"
                label="Contact"
                radius={0.8}
                position={[ -2.8, -0.9, -6.5 ]}
                rotationSpeed={0.007}
                axialTilt={0.18}
                onClick={onPlanetClick}
            />
        </group>
    );
}