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
        area: 0,
        foodSpawnRate: {

            valid: true,
            value: "1"
        },
        foodMaxAge: {

            valid: true,
            value: "30"
        },
        initialFood: {

            valid: true,
            value: "10"
        },

        regenerateEntities: true,
        regenerationInterval: {

            valid: true,
            value: "5"
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

                value: "120",
                valid: true
            },
            maxForceAngle: {

                value: "270",
                valid: true
            },
            maxForceMagnitude: {

                value: "25",
                valid: true
            },
            perceptionRadius: {

                value: "300",
                valid: true
            },
            perceptionAngle: {

                value: "200",
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

                value: "5",
                valid: true
            },
            healthDelta: {

                value: "5",
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

                value: "300",
                valid: true
            },
            eatingThreshold: {

                value: "75",
                valid: true
            },
            mutationModifier: {

                value: "1",
                valid: true
            }

        },

        preys: {

            initialCount: {

                value: "0",
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

                value: "450",
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

                value: "1.5",
                valid: true
            },
            hungerDecay: {

                value: "5",
                valid: true
            },
            healthDelta: {

                value: "10",
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

                value: "200",
                valid: true
            },
            eatingThreshold: {

                value: "75",
                valid: true
            },
            mutationModifier: {

                value: "1",
                valid: true
            }
        }
    },

];