/**
 * File: templates.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 28.4.2020
 * License: none
 * Description: Defines various simulation scenario templates.
 * 
 */

// import type information
import { SetupState } from "./types/setup";

export const templates: Array<SetupState> = [

    {
        drawQuadTree: false,
        area: 1,
        foodSpawnRate: {

            valid: true,
            value: "0"
        },
        foodMaxAge: {

            valid: true,
            value: "0"
        },
        initialFood: {

            valid: true,
            value: "0"
        },

        regenerateEntities: false,
        regenerationInterval: {

            valid: true,
            value: "0"
        },

        predators: {
            
            initialCount: {

                value: "0",
                valid: true
            },
            minCount: {

                value: "0",
                valid: true
            },
            speed: {

                value: "0",
                valid: true
            },
            maxForceAngle: {

                value: "0",
                valid: true
            },
            maxForceMagnitude: {

                value: "0",
                valid: true
            },
            perceptionRadius: {

                value: "0",
                valid: true
            },
            perceptionAngle: {

                value: "0",
                valid: true
            },
            alignmentModifier: {

                value: "0",
                valid: true
            },
            cohesionModifier: {

                value: "0",
                valid: true
            },
            separationModifier: {

                value: "0",
                valid: true
            },
            hungerDecay: {

                value: "0",
                valid: true
            },
            healthDelta: {

                value: "0",
                valid: true
            },
            health: {

                value: "0",
                valid: true
            },
            hunger: {

                value: "0",
                valid: true
            },
            reproductionInterval: {

                value: "0",
                valid: true
            },
            maxAge: {

                value: "0",
                valid: true
            },
            eatingThreshold: {

                value: "0",
                valid: true
            },
            mutationModifier: {

                value: "0",
                valid: true
            }

        },

        preys: {

            initialCount: {

                value: "10",
                valid: true
            },
            minCount: {

                value: "0",
                valid: true
            },
            speed: {

                value: "100",
                valid: true
            },
            maxForceAngle: {

                value: "270",
                valid: true
            },
            maxForceMagnitude: {

                value: "20",
                valid: true
            },
            perceptionRadius: {

                value: "200",
                valid: true
            },
            perceptionAngle: {

                value: "270",
                valid: true
            },
            alignmentModifier: {

                value: "1",
                valid: true
            },
            cohesionModifier: {

                value: "1",
                valid: true
            },
            separationModifier: {

                value: "1",
                valid: true
            },
            hungerDecay: {

                value: "0",
                valid: true
            },
            healthDelta: {

                value: "0",
                valid: true
            },
            health: {

                value: "100",
                valid: true
            },
            hunger: {

                value: "100",
                valid: true
            },
            reproductionInterval: {

                value: "30",
                valid: true
            },
            maxAge: {

                value: "150",
                valid: true
            },
            eatingThreshold: {

                value: "100",
                valid: true
            },
            mutationModifier: {

                value: "0",
                valid: true
            }
        }
    },

];