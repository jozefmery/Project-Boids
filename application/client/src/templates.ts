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

const needForPredation = {

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
};

const controlWithFood = {

    drawQuadTree: false,
    area: 2,
    foodSpawnRate: {

        valid: true,
        value: "2"
    },
    foodMaxAge: {

        valid: true,
        value: "30"
    },
    initialFood: {

        valid: true,
        value: "50"
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

            value: "0",
            valid: true
        },
        minCount: {

            value: "5",
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

            value: "3",
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

            value: "150",
            valid: true
        },
        eatingThreshold: {

            value: "60",
            valid: true
        },
        mutationModifier: {

            value: "0",
            valid: true
        }
    }
};

const absenceOfFlocking = {

    drawQuadTree: false,
    area: 3,
    foodSpawnRate: {

        valid: true,
        value: "3"
    },
    foodMaxAge: {

        valid: true,
        value: "30"
    },
    initialFood: {

        valid: true,
        value: "100"
    },

    regenerateEntities: true,
    regenerationInterval: {

        valid: true,
        value: "8"
    },

    predators: {
        
        initialCount: {

            value: "0",
            valid: true
        },
        minCount: {

            value: "3",
            valid: true
        },
        speed: {

            value: "110",
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

            value: "2",
            valid: true
        },
        healthDelta: {

            value: "3",
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

            value: "40",
            valid: true
        },
        maxAge: {

            value: "300",
            valid: true
        },
        eatingThreshold: {

            value: "70",
            valid: true
        },
        mutationModifier: {

            value: "0",
            valid: true
        }

    },

    preys: {

        initialCount: {

            value: "30",
            valid: true
        },
        minCount: {

            value: "10",
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

            value: "30",
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

            value: "3",
            valid: true
        },
        healthDelta: {

            value: "4",
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

            value: "180",
            valid: true
        },
        eatingThreshold: {

            value: "65",
            valid: true
        },
        mutationModifier: {

            value: "0",
            valid: true
        }
    }
};

const presenceOfFlocking = {

    drawQuadTree: false,
    area: 3,
    foodSpawnRate: {

        valid: true,
        value: "3"
    },
    foodMaxAge: {

        valid: true,
        value: "30"
    },
    initialFood: {

        valid: true,
        value: "100"
    },

    regenerateEntities: true,
    regenerationInterval: {

        valid: true,
        value: "8"
    },

    predators: {
        
        initialCount: {

            value: "0",
            valid: true
        },
        minCount: {

            value: "3",
            valid: true
        },
        speed: {

            value: "110",
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

            value: "2",
            valid: true
        },
        healthDelta: {

            value: "3",
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

            value: "40",
            valid: true
        },
        maxAge: {

            value: "300",
            valid: true
        },
        eatingThreshold: {

            value: "70",
            valid: true
        },
        mutationModifier: {

            value: "0",
            valid: true
        }

    },

    preys: {

        initialCount: {

            value: "30",
            valid: true
        },
        minCount: {

            value: "10",
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

            value: "30",
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

            value: "3",
            valid: true
        },
        healthDelta: {

            value: "4",
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

            value: "180",
            valid: true
        },
        eatingThreshold: {

            value: "65",
            valid: true
        },
        mutationModifier: {

            value: "0",
            valid: true
        }
    }
};

const mutation = {

    drawQuadTree: false,
    area: 3,
    foodSpawnRate: {

        valid: true,
        value: "3"
    },
    foodMaxAge: {

        valid: true,
        value: "30"
    },
    initialFood: {

        valid: true,
        value: "100"
    },

    regenerateEntities: true,
    regenerationInterval: {

        valid: true,
        value: "8"
    },

    predators: {
        
        initialCount: {

            value: "3",
            valid: true
        },
        minCount: {

            value: "5",
            valid: true
        },
        speed: {

            value: "110",
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

            value: "2",
            valid: true
        },
        healthDelta: {

            value: "3",
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

            value: "40",
            valid: true
        },
        maxAge: {

            value: "300",
            valid: true
        },
        eatingThreshold: {

            value: "70",
            valid: true
        },
        mutationModifier: {

            value: "1",
            valid: true
        }

    },

    preys: {

        initialCount: {

            value: "50",
            valid: true
        },
        minCount: {

            value: "10",
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

            value: "30",
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

            value: "3",
            valid: true
        },
        healthDelta: {

            value: "4",
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

            value: "180",
            valid: true
        },
        eatingThreshold: {

            value: "65",
            valid: true
        },
        mutationModifier: {

            value: "1",
            valid: true
        }
    }
};

export const templates: Array<SetupState> = [needForPredation, controlWithFood, absenceOfFlocking, presenceOfFlocking, mutation];