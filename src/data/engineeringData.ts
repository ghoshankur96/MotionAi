import { WorksheetProblem, Assignment } from '../types';

export const MATH_PROBLEMS: WorksheetProblem[] = [
  {
    problem_id: 'MATH-201-01',
    category: 'Engineering Mathematics',
    topic: 'Differential Equations',
    difficulty: 'Intermediate',
    problem_statement: 'Solve the second-order homogeneous linear ODE governing an underdamped mechanical oscillator: d²x/dt² + 4(dx/dt) + 20x = 0 with initial conditions x(0) = 2, x\'(0) = 0.',
    given_data: 'm = 1 kg, c = 4 N·s/m, k = 20 N/m, x(0) = 2 m, v(0) = 0 m/s',
    governing_formula: 'r² + 2ζωₙr + ωₙ² = 0; x(t) = e^(-αt)[C₁cos(βt) + C₂sin(βt)]',
    solution_answer: 'x(t) = e^(-2t) [2·cos(4t) + sin(4t)] m',
    points: 25,
    status: 'Verified'
  },
  {
    problem_id: 'MATH-201-02',
    category: 'Engineering Mathematics',
    topic: 'Linear Algebra & Eigenvalues',
    difficulty: 'Intermediate',
    problem_statement: 'Determine the characteristic eigenvalues and normalized eigenvectors for the 2x2 stiffness matrix A = [[5, 2], [2, 8]] representing a two-degree-of-freedom spring-mass system.',
    given_data: 'Matrix A = [[5, 2], [2, 8]]',
    governing_formula: 'det(A - λI) = 0; (A - λI)v = 0',
    solution_answer: 'λ₁ = 4 (v₁ = [-2, 1]ᵀ/√5), λ₂ = 9 (v₂ = [1, 2]ᵀ/√5)',
    points: 25,
    status: 'Attempted'
  },
  {
    problem_id: 'MATH-201-03',
    category: 'Engineering Mathematics',
    topic: 'Laplace Transforms',
    difficulty: 'Advanced',
    problem_statement: 'Find the Laplace transform of the piecewise unit impulse driving function f(t) = 5·e^(-3t)·sin(4t) + 3·u(t - 2)·(t - 2)², where u(t) is the Heaviside step function.',
    given_data: 'f(t) with exponential decay and time-shifted step response',
    governing_formula: 'L{e^(-at)sin(ωt)} = ω / ((s + a)² + ω²); L{u(t - c)g(t - c)} = e^(-cs)G(s)',
    solution_answer: 'F(s) = 20 / ((s + 3)² + 16) + 6·e^(-2s) / s³',
    points: 25,
    status: 'Unsolved'
  },
  {
    problem_id: 'MATH-201-04',
    category: 'Engineering Mathematics',
    topic: 'Numerical Methods',
    difficulty: 'Basic',
    problem_statement: 'Apply the Newton-Raphson iteration algorithm to estimate the root of f(x) = x³ - 2x - 5 = 0 starting from initial guess x₀ = 2.0 to 3 decimal places.',
    given_data: 'f(x) = x³ - 2x - 5; x₀ = 2.0; tolerance = 1e-4',
    governing_formula: 'x_{n+1} = x_n - [f(x_n) / f\'(x_n)]',
    solution_answer: 'x₁ = 2.100, x₂ = 2.0946, Root ≈ 2.095',
    points: 25,
    status: 'Verified'
  }
];

export const MECHANICS_PROBLEMS: WorksheetProblem[] = [
  {
    problem_id: 'MECH-102-01',
    category: 'Engineering Mechanics',
    topic: 'Truss Analysis (Method of Joints)',
    difficulty: 'Intermediate',
    problem_statement: 'For a Warren bridge truss of span L = 12 m with height h = 3 m, a downward concentrated load of P = 60 kN acts at joint C. Compute the axial forces in members AB, BC, and AC, and classify them as tension (T) or compression (C).',
    given_data: 'Span L = 12 m, Height h = 3 m, Joint load P = 60 kN at midspan',
    governing_formula: 'ΣF_x = 0, ΣF_y = 0, ΣM_joint = 0',
    solution_answer: 'F_AC = 34.64 kN (Tension), F_AB = 42.43 kN (Compression), F_BC = 30.00 kN (Tension)',
    points: 25,
    status: 'Verified'
  },
  {
    problem_id: 'MECH-102-02',
    category: 'Engineering Mechanics',
    topic: 'Shear Force & Bending Moments',
    difficulty: 'Advanced',
    problem_statement: 'A simply supported steel beam of length L = 6 m carries a uniformly distributed load (UDL) of w = 15 kN/m across its entire span and a point load of 30 kN at x = 2 m from support A. Find the maximum bending moment and its location.',
    given_data: 'L = 6 m, w = 15 kN/m, P = 30 kN at x = 2 m; R_A = 65 kN, R_B = 55 kN',
    governing_formula: 'V(x) = R_A - P⟨x - 2⟩⁰ - wx; M(x) = R_A·x - P⟨x - 2⟩¹ - (w·x²)/2; M_max where V(x) = 0',
    solution_answer: 'M_max = 100.83 kN·m at x = 2.33 m from left support A',
    points: 25,
    status: 'Attempted'
  },
  {
    problem_id: 'MECH-102-03',
    category: 'Engineering Mechanics',
    topic: 'Stress-Strain & Hooke\'s Law',
    difficulty: 'Basic',
    problem_statement: 'A cylindrical structural titanium alloy tie rod with diameter d = 25 mm and length L = 2.5 m is subjected to an axial tensile force F = 85 kN. Calculate the tensile stress, axial strain, and total elongation if E = 110 GPa.',
    given_data: 'd = 0.025 m, L = 2.5 m, F = 85,000 N, E = 110 × 10⁹ Pa',
    governing_formula: 'A = πd²/4; σ = F/A; ε = σ/E; ΔL = (F·L) / (A·E)',
    solution_answer: 'σ = 173.16 MPa, ε = 1.574 × 10⁻³, Elongation ΔL = 3.935 mm',
    points: 25,
    status: 'Verified'
  },
  {
    problem_id: 'MECH-102-04',
    category: 'Engineering Mechanics',
    topic: 'Rigid Body Kinematics & Inertia',
    difficulty: 'Advanced',
    problem_statement: 'A uniform solid cylinder of mass m = 12 kg and radius R = 0.3 m rolls without slipping down a 30° incline plane. Determine the linear acceleration of its center of mass and the required minimum coefficient of static friction μ_s.',
    given_data: 'm = 12 kg, R = 0.3 m, θ = 30°, g = 9.81 m/s², I_G = 0.5·m·R²',
    governing_formula: 'a_G = (g·sinθ) / (1 + I_G/(m·R²)) = (2/3)·g·sinθ; f_s = (1/3)·m·g·sinθ ≤ μ_s·m·g·cosθ',
    solution_answer: 'a_G = 3.27 m/s² (downward), Min μ_s = (1/3)·tan(30°) = 0.192',
    points: 25,
    status: 'Unsolved'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    title: 'Problem Set 4: Differential Equations & Vibrations',
    subject: 'Engineering Mathematics',
    module: 'Module 3: Linear Systems & ODEs',
    description: 'Solve the assigned 4 engineering calculus and dynamic system problems. Show complete mathematical derivations, characteristic roots, and final physical units. Attach your handwritten solution sheet or PDF scan.',
    due_date: 'Friday, Nov 13, 2026, 11:59 PM',
    points: 100,
    problems: MATH_PROBLEMS,
    status: 'Assigned'
  },
  {
    id: 'asg-02',
    title: 'Mechanics Lab 02: Simply Supported Truss & Beam Stress Analysis',
    subject: 'Engineering Mechanics',
    module: 'Module 2: Structural Statics & Internal Loads',
    description: 'Perform complete Free-Body Diagram (FBD) derivations, calculate reactions at pinned supports, plot Shear Force Diagram (SFD) & Bending Moment Diagram (BMD), and identify the critical stress section.',
    due_date: 'Monday, Nov 16, 2026, 05:00 PM',
    points: 100,
    problems: MECHANICS_PROBLEMS,
    status: 'Turned In',
    submission: {
      submitted_at: 'Friday, Nov 7, 2026, 04:30 PM',
      student_response: 'Calculated all reactions: R_A = 65 kN, R_B = 55 kN. Solved zero shear point at x = 2.33 m yielding M_max = 100.83 kN·m. Truss joint equilibrium verified with zero residue.',
      attached_file_name: 'Rahul_Mechanics_Lab02_Submission.pdf',
      grade: 96,
      feedback: 'Excellent FBD derivation and accurate Bending Moment Diagram. Clean method of joints execution.'
    }
  },
  {
    id: 'asg-03',
    title: 'Calculus Worksheet: Eigenvalues & Stability of Dynamical Systems',
    subject: 'Engineering Mathematics',
    module: 'Module 4: Matrix Algebra & Modal Analysis',
    description: 'Determine characteristic roots, modal vectors, and state-space equilibrium points for multivariable mechanical and electrical systems.',
    due_date: 'Wednesday, Nov 18, 2026, 11:59 PM',
    points: 50,
    problems: [MATH_PROBLEMS[1], MATH_PROBLEMS[2]],
    status: 'Assigned'
  }
];
